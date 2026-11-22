import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginThrottle, MAX_FAILED_ATTEMPTS } from './login-throttle';

const user = {
  id: 'u1',
  email: 'me@example.com',
  passwordHash: 'hash',
  displayName: 'me',
  createdAt: new Date('2026-11-21T10:00:00Z'),
};

function fakeRequest() {
  const session: Record<string, unknown> = {};
  session.regenerate = jest.fn((cb: (err?: unknown) => void) => cb());
  session.save = jest.fn((cb: (err?: unknown) => void) => cb());
  session.destroy = jest.fn((cb: (err?: unknown) => void) => cb());
  return { ip: '127.0.0.1', session } as unknown as Request & { session: Record<string, unknown> };
}

describe('AuthController', () => {
  const validateCredentials = jest.fn();
  const auth = { validateCredentials } as unknown as AuthService;
  let throttle: LoginThrottle;
  let controller: AuthController;
  const body = { email: 'me@example.com', password: 'correct horse battery' };

  beforeEach(() => {
    validateCredentials.mockReset();
    throttle = new LoginThrottle();
    controller = new AuthController(auth, throttle);
  });

  describe('login', () => {
    it('signs in: new session id, user id stored, user returned without the hash', async () => {
      validateCredentials.mockResolvedValue(user);
      const req = fakeRequest();

      const result = await controller.login(body, req);

      expect(req.session.regenerate).toHaveBeenCalled();
      expect(req.session.userId).toBe('u1');
      expect(req.session.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'u1',
        email: 'me@example.com',
        display_name: 'me',
        created_at: '2026-11-21T10:00:00.000Z',
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('rejects wrong credentials with 401 and does not create a session', async () => {
      validateCredentials.mockResolvedValue(null);
      const req = fakeRequest();

      await expect(controller.login(body, req)).rejects.toBeInstanceOf(UnauthorizedException);
      expect(req.session.userId).toBeUndefined();
    });

    it('returns 429 after too many failed attempts, without checking the password', async () => {
      validateCredentials.mockResolvedValue(null);
      for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) {
        await controller.login(body, fakeRequest()).catch(() => undefined);
      }
      validateCredentials.mockClear();

      const error = await controller.login(body, fakeRequest()).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(validateCredentials).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('destroys the session and clears the cookie', async () => {
      const req = fakeRequest();
      const res = { clearCookie: jest.fn() } as unknown as Response & { clearCookie: jest.Mock };

      await controller.logout(req, res);

      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith('sid', expect.objectContaining({ path: '/' }));
    });
  });

  it('me returns the signed-in user', () => {
    expect(controller.me(user)).toMatchObject({ id: 'u1', email: 'me@example.com' });
  });
});

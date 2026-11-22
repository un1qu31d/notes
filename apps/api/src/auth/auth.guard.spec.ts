import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

function contextFor(request: object): ExecutionContext {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() } as unknown as Reflector & {
    getAllAndOverride: jest.Mock;
  };
  const auth = { findById: jest.fn() } as unknown as AuthService & { findById: jest.Mock };
  const guard = new AuthGuard(reflector, auth);
  const user = { id: 'u1', email: 'me@example.com' };

  beforeEach(() => {
    reflector.getAllAndOverride.mockReturnValue(false);
    auth.findById.mockReset();
  });

  it('lets public routes through without a session', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    await expect(guard.canActivate(contextFor({}))).resolves.toBe(true);
  });

  it('rejects requests without a session', async () => {
    await expect(guard.canActivate(contextFor({ session: {} }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('accepts a session for an existing user and attaches the user', async () => {
    auth.findById.mockResolvedValue(user);
    const request: Record<string, unknown> = { session: { userId: 'u1' } };
    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request.user).toBe(user);
  });

  it('rejects and ends the session when the user no longer exists', async () => {
    auth.findById.mockResolvedValue(null);
    const destroy = jest.fn();
    const request = { session: { userId: 'gone', destroy } };
    await expect(guard.canActivate(contextFor(request))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(destroy).toHaveBeenCalled();
  });
});

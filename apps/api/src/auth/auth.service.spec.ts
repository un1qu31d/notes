import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const findUnique = jest.fn();
  const prisma = { user: { findUnique } } as unknown as PrismaService;
  const service = new AuthService(prisma);
  let user: { id: string; email: string; passwordHash: string };

  beforeAll(async () => {
    user = {
      id: 'u1',
      email: 'me@example.com',
      passwordHash: await argon2.hash('correct horse battery', { type: argon2.argon2id }),
    };
  });

  beforeEach(() => findUnique.mockReset());

  it('returns the user for the right password', async () => {
    findUnique.mockResolvedValue(user);
    await expect(service.validateCredentials('me@example.com', 'correct horse battery')).resolves.toBe(user);
  });

  it('matches the email case-insensitively and ignores surrounding spaces', async () => {
    findUnique.mockResolvedValue(user);
    await service.validateCredentials('  Me@Example.com ', 'correct horse battery');
    expect(findUnique).toHaveBeenCalledWith({ where: { email: 'me@example.com' } });
  });

  it('returns null for a wrong password', async () => {
    findUnique.mockResolvedValue(user);
    await expect(service.validateCredentials('me@example.com', 'wrong password')).resolves.toBeNull();
  });

  it('returns null for an unknown email', async () => {
    findUnique.mockResolvedValue(null);
    await expect(service.validateCredentials('nobody@example.com', 'whatever')).resolves.toBeNull();
  });
});

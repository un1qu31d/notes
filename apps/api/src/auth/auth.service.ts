import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  /** Hash checked when the email is unknown, so both cases take about the same time. */
  private dummyHash?: Promise<string>;

  constructor(private readonly prisma: PrismaService) {}

  /** Returns the user if the email and password match, otherwise null. */
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      await argon2.verify(await this.getDummyHash(), password).catch(() => false);
      return null;
    }

    const valid = await argon2.verify(user.passwordHash, password).catch(() => false);
    return valid ? user : null;
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= argon2.hash('not-a-real-password', { type: argon2.argon2id });
    return this.dummyHash;
  }
}

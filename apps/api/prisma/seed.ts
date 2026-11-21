/**
 * Creates (or updates) the single owner account — FR-04.
 * Run with `npm run db:seed` from the repository root after setting
 * OWNER_EMAIL and OWNER_PASSWORD in .env. Remove them from .env afterwards.
 */
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const MIN_PASSWORD_LENGTH = 10;

async function main(): Promise<void> {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    throw new Error('Set OWNER_EMAIL and OWNER_PASSWORD in .env before seeding.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`OWNER_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash, displayName: email.split('@')[0] },
    });
    console.log(`Owner account ready: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

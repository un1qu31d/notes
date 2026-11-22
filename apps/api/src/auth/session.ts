import type { INestApplication } from '@nestjs/common';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export const SESSION_COOKIE = 'sid';
/** Sessions expire after 30 days without activity (Specifications §6). */
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    // HTTPS only once hosted (NFR-03); plain HTTP is fine on localhost.
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

/**
 * Cookie-based sessions stored in PostgreSQL (the `session` table in
 * schema.prisma), so signing in survives API restarts.
 */
export function configureSession(app: INestApplication): void {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters.');
  }

  if (process.env.NODE_ENV === 'production') {
    // Behind a hosting proxy, trust X-Forwarded-Proto so Secure cookies are set.
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  const PgStore = connectPgSimple(session);

  app.use(
    session({
      name: SESSION_COOKIE,
      secret,
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: false, // created by Prisma migrations
      }),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: { ...sessionCookieOptions(), maxAge: SESSION_MAX_AGE_MS },
    }),
  );
}

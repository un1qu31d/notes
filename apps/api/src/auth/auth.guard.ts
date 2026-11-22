import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { User } from '@prisma/client';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';

export type AuthenticatedRequest = Request & { user: User };

/**
 * Applied to every route (FR-01, NFR-03). Routes marked @Public() skip it;
 * all others need a session belonging to an existing user.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: User }>();
    const userId = request.session?.userId;
    const user = userId ? await this.auth.findById(userId) : null;

    if (!user) {
      if (userId) request.session.destroy(() => undefined); // user no longer exists
      throw new UnauthorizedException({
        error: { code: 'not_signed_in', message: 'Sign in to continue.' },
      });
    }

    request.user = user;
    return true;
  }
}

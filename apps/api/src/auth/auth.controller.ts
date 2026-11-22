import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { User as UserRow } from '@prisma/client';
import type { Request, Response } from 'express';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { LoginThrottle } from './login-throttle';
import { Public } from './public.decorator';
import { SESSION_COOKIE, sessionCookieOptions } from './session';
import { toUserResponse } from './user.mapper';

/** Sign in and sign out — FR-01 (Jira NOTES-12), Specifications §3.2 Auth. */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly throttle: LoginThrottle,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Signed in; sets the session cookie' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '`validation_error`' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '`invalid_credentials`' })
  @ApiTooManyRequestsResponse({ type: ErrorResponseDto, description: '`too_many_attempts` — 5 failed sign-ins in 15 minutes' })
  async login(@Body() body: LoginDto, @Req() req: Request): Promise<UserDto> {
    const keys = [`email:${body.email.trim().toLowerCase()}`, `ip:${req.ip ?? 'unknown'}`];

    if (this.throttle.isBlocked(keys)) {
      throw new HttpException(
        {
          error: {
            code: 'too_many_attempts',
            message: 'Too many failed sign-in attempts. Try again in 15 minutes.',
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.auth.validateCredentials(body.email, body.password);
    if (!user) {
      this.throttle.recordFailure(keys);
      throw new UnauthorizedException({
        error: { code: 'invalid_credentials', message: 'Email or password is incorrect.' },
      });
    }

    this.throttle.reset(keys);
    // New session id on sign-in, so an id set before sign-in can't be reused.
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve())),
    );
    req.session.userId = user.id;
    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve())),
    );

    return toUserResponse(user);
  }

  /** Public so signing out always succeeds, even with an expired session. */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Signed out; the session is deleted' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    if (req.session) {
      await new Promise<void>((resolve, reject) =>
        req.session.destroy((err) => (err ? reject(err) : resolve())),
      );
    }
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
  }

  @Get('me')
  @ApiOkResponse({ type: UserDto, description: 'The signed-in user' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '`not_signed_in`' })
  me(@CurrentUser() user: UserRow): UserDto {
    return toUserResponse(user);
  }
}

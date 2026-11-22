import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginThrottle } from './login-throttle';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: LoginThrottle, useFactory: () => new LoginThrottle() },
    // Every route requires a signed-in user unless marked @Public().
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}

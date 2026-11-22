import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

// Feature modules (notes, subjects, tags, export) are added as their
// Jira stories are picked up — see Specifications §1.2.
@Module({
  imports: [PrismaModule, AuthModule, HealthModule],
})
export class AppModule {}

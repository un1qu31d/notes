import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

// Feature modules (auth, notes, subjects, tags, export) are added as their
// Jira stories are picked up — see Specifications §1.2.
@Module({
  imports: [PrismaModule, HealthModule],
})
export class AppModule {}

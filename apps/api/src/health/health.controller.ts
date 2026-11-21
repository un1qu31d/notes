import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import type { HealthStatus } from '@notes/shared';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GET /api/v1/health — public. Used by the web app's offline indicator
 * (NFR-15, Specifications §4.5) to check that the API and database are reachable.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({ description: 'API and database are reachable' })
  @ApiServiceUnavailableResponse({ description: 'Database is not reachable' })
  async check(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        error: { code: 'database_unavailable', message: 'Database is not reachable' },
      });
    }
    return { status: 'ok' };
  }
}

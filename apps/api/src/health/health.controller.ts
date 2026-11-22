import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HealthStatusDto } from './dto/health-status.dto';

/**
 * GET /api/v1/health — public. Used by the web app's offline indicator
 * (NFR-15, Specifications §4.5) to check that the API and database are reachable.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: HealthStatusDto, description: 'API and database are reachable' })
  @ApiServiceUnavailableResponse({ type: ErrorResponseDto, description: '`database_unavailable`' })
  async check(): Promise<HealthStatusDto> {
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

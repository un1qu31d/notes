import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

const CODES: Record<number, string> = {
  400: 'validation_error',
  401: 'not_signed_in',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  429: 'too_many_requests',
  503: 'service_unavailable',
};

/**
 * Turns every error into the shape from Specifications §3.1:
 * { "error": { "code", "message", "fields"? } }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (!(exception instanceof HttpException)) {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: { code: 'internal_error', message: 'Something went wrong.' },
      });
      return;
    }

    const status = exception.getStatus();
    const body = exception.getResponse();

    // Already in our shape (thrown with { error: {...} }).
    if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'object') {
      res.status(status).json(body);
      return;
    }

    // Nest's default shape, e.g. from ValidationPipe: { message: string | string[] }.
    const raw = typeof body === 'string' ? body : (body as { message?: string | string[] }).message;
    const messages = Array.isArray(raw) ? raw : [raw ?? exception.message];
    res.status(status).json({
      error: {
        code: CODES[status] ?? 'error',
        message: messages.join('; '),
      },
    });
  }
}

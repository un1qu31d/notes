import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureSession } from './auth/session';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { API_PREFIX, buildOpenApiDocument } from './openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  configureSession(app);
  app.enableShutdownHooks();

  // API docs, outside production only:
  //   /api/docs       interactive Swagger UI
  //   /api/docs-json  the OpenAPI contract that @notes/api-client is generated from
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, buildOpenApiDocument(app), {
      jsonDocumentUrl: 'api/docs-json',
      swaggerOptions: { withCredentials: true, persistAuthorization: true },
    });
  }

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/${API_PREFIX}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`API docs: http://localhost:${port}/api/docs (contract: /api/docs-json)`);
  }
}

void bootstrap();

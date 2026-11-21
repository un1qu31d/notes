import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route lives under /api/v1 (Specifications §3).
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableShutdownHooks();

  // OpenAPI docs at /api/docs (NFR-09).
  const config = new DocumentBuilder()
    .setTitle('Learning Notes API')
    .setVersion('0.1.0')
    .addCookieAuth('sid')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api/v1 (docs: /api/docs)`);
}

void bootstrap();

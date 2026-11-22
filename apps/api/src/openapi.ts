import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

/** Every route lives under /api/v1 (Specifications §3). */
export const API_PREFIX = 'api/v1';

/**
 * The API contract, built from the controllers and DTOs — the single source of
 * truth for what the API accepts and returns. Served over HTTP at
 * /api/docs-json (outside production); clients such as @notes/api-client
 * download it from there. The API never writes it anywhere.
 */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Learning Notes API')
    .setDescription('REST API for the Learning Notes System. See Confluence › Specifications §3.')
    .setVersion('0.1.0')
    .build();

  return SwaggerModule.createDocument(app, config, {
    // Stable, readable operation ids: AuthController.login → "authLogin".
    // Clients generate names from these (authLogin, useAuthLogin, authLoginBody…).
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      const resource = controllerKey.replace(/Controller$/, '');
      return resource.charAt(0).toLowerCase() + resource.slice(1) + methodKey.charAt(0).toUpperCase() + methodKey.slice(1);
    },
  });
}

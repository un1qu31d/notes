// Public entry point: @notes/api-client
// Framework-agnostic — typed functions, models and Zod schemas.
export * from './generated/client';
export * from './generated/model';
export * as schemas from './generated/zod';
export {
  ApiRequestError,
  configureApiClient,
  errorMessage,
  type ApiClientConfig,
  type ApiErrorBody,
} from './fetcher';

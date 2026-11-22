/** The body of every error response (Specifications §3.1). */
export class ErrorDetailDto {
  /** Machine-readable error code, e.g. `invalid_credentials`. */
  code: string;

  /** Human-readable message, safe to show to the user. */
  message: string;

  /** Per-field messages for validation errors. */
  fields?: Record<string, string>;
}

export class ErrorResponseDto {
  error: ErrorDetailDto;
}

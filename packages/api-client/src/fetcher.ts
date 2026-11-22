/**
 * The only place in the SDK that calls fetch(). Every generated function goes
 * through apiFetch. The contract's paths already include /api/v1, so by
 * default requests go to the current origin (the web app proxies /api/* to the
 * API). Other clients can point the SDK elsewhere with configureApiClient().
 */

/** Error body returned by the API for every failure. */
export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body?: ApiErrorBody,
  ) {
    super(body?.error.message ?? `Request failed with status ${status}`);
    this.name = 'ApiRequestError';
  }

  get code(): string | undefined {
    return this.body?.error.code;
  }
}

export interface ApiClientConfig {
  /** Prepended to every path, e.g. "https://api.example.com". Default: "" (same origin). */
  baseUrl: string;
  /** Default: "same-origin". Use "include" when the API is on another origin. */
  credentials: RequestCredentials;
}

const config: ApiClientConfig = { baseUrl: '', credentials: 'same-origin' };

export function configureApiClient(options: Partial<ApiClientConfig>): void {
  Object.assign(config, options);
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${config.baseUrl}${url}`, {
    ...options,
    credentials: config.credentials,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => undefined)) as ApiErrorBody | undefined;
    throw new ApiRequestError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** A message safe to show the user for any error thrown by an API call. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiRequestError && err.body) return err.body.error.message;
  return 'Could not reach the server. Check your connection and try again.';
}

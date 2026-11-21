import type { ApiError, HealthStatus } from '@notes/shared';

/** Base path for API calls. Same-origin: Next.js rewrites /api/* to the NestJS API. */
const BASE = '/api/v1';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body?: ApiError,
  ) {
    super(body?.error.message ?? `Request failed with status ${status}`);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => undefined)) as ApiError | undefined;
    throw new ApiRequestError(res.status, body);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const getHealth = () => apiFetch<HealthStatus>('/health');

'use client';

import { useHealthCheck } from '@notes/api-client/react';

/** Smoke test for the web → API → database chain via GET /api/v1/health. */
export function ApiStatus() {
  const { isPending, isSuccess } = useHealthCheck();
  const state = isPending ? 'checking' : isSuccess ? 'ok' : 'down';

  const label = {
    checking: 'Checking API…',
    ok: 'API and database are reachable',
    down: 'Cannot reach the API — is it running and is the database up?',
  }[state];

  const dot = { checking: 'bg-stone-400', ok: 'bg-emerald-500', down: 'bg-red-500' }[state];

  return (
    <p className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
      <span role="status">{label}</span>
    </p>
  );
}

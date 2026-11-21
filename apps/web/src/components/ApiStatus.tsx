'use client';

import { useEffect, useState } from 'react';
import { getHealth } from '@/lib/api';

type State = 'checking' | 'ok' | 'down';

/** Smoke test for the web → API → database chain via GET /api/v1/health. */
export function ApiStatus() {
  const [state, setState] = useState<State>('checking');

  useEffect(() => {
    getHealth()
      .then(() => setState('ok'))
      .catch(() => setState('down'));
  }, []);

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

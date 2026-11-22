'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ApiRequestError } from '@notes/api-client';
import { useAuthLogout, useAuthMe } from '@notes/api-client/react';

/** Shows who is signed in, with a sign-out button. Sends you to /login if the session has ended. */
export function AccountBar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const me = useAuthMe();
  const logout = useAuthLogout();

  useEffect(() => {
    if (me.error instanceof ApiRequestError && me.error.status === 401) router.replace('/login');
  }, [me.error, router]);

  async function handleSignOut() {
    try {
      await logout.mutateAsync();
    } finally {
      queryClient.clear(); // drop everything cached for the signed-in user
      router.replace('/login');
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm">
      <span className="text-stone-600">
        {me.data ? (
          <>
            Signed in as <span className="font-medium text-stone-900">{me.data.email}</span>
          </>
        ) : (
          'Loading…'
        )}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={logout.isPending}
        className="rounded-md border border-stone-300 px-3 py-1.5 font-medium hover:bg-stone-100 disabled:opacity-50"
      >
        {logout.isPending ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  );
}

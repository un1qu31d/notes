'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ApiRequestError } from '@notes/api-client';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry network problems and 5xx, never 4xx (e.g. 401 means "sign in", not "try again").
            retry: (failureCount, error) =>
              !(error instanceof ApiRequestError && error.status < 500) && failureCount < 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

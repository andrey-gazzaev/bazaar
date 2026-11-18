'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { memo, useState, type ReactNode } from 'react';

/** Query cache for the shop. */
const ProvidersComponent = function({ children }: { readonly children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

ProvidersComponent.displayName = 'Providers';
export const Providers = memo(ProvidersComponent);

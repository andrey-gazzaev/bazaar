'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { memo, useState, type ReactNode } from 'react';
import { SessionProvider } from '@/context';
import type { SessionUser } from '@/models';
import { sessionKeys } from '@/queries/session/keys';

/** Query cache and the signed-in person. */
const ProvidersComponent = function({
  user,
  children,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;

  /** Tree that reads the session. */
  readonly children: ReactNode;
}) {
  const [client] = useState(() => {
    const next = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 30_000, refetchOnWindowFocus: false },
      },
    });

    next.setQueryData(sessionKeys.all, user);

    return next;
  });

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}

ProvidersComponent.displayName = 'Providers';
export const Providers = memo(ProvidersComponent);

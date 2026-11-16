'use client';

import { useMemo, type ReactNode } from 'react';
import { useSession } from '@/queries';
import { SessionContext, type SessionValue } from './session-context';

/** Loads the signed-in person once for the tree under it. */
export function SessionProvider({ children }: { readonly children: ReactNode }) {
  const session = useSession();
  const error = session.error instanceof Error ? session.error.message : null;

  const value = useMemo(
    (): SessionValue => ({
      user: session.data ?? null,
      isLoading: session.isLoading,
      error,
    }),
    [session.data, session.isLoading, error],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

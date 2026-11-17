'use client';

import { memo, useMemo, type ReactNode } from 'react';
import { useSession } from '@/queries';
import { SessionContext, type SessionValue } from './session-context';

/** Shares the signed-in person with the tree under it. */
const SessionProviderComponent = function({ children }: { readonly children: ReactNode }) {
  const session = useSession();

  const value = useMemo(
    (): SessionValue => ({
      user: session.data ?? null,
    }),
    [session.data],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

SessionProviderComponent.displayName = 'SessionProvider';
export const SessionProvider = memo(SessionProviderComponent);

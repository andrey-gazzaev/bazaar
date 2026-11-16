import { createContext } from 'react';
import type { SessionUser } from '@/models';

/** Signed-in person shared with one subtree. */
export type SessionValue = {
  /** Person for the cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;

  /** True while the first read is in flight. */
  readonly isLoading: boolean;

  /** Why the session could not be read. Null when it succeeded. */
  readonly error: string | null;
};

export const SessionContext = createContext<SessionValue | undefined>(undefined);

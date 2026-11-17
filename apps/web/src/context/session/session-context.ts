import { createContext } from 'react';
import type { SessionUser } from '@/models';

/** Signed-in person shared with one subtree. */
export type SessionValue = {
  /** Person for this browser. Null when nobody is signed in. */
  readonly user: SessionUser | null;
};

export const SessionContext = createContext<SessionValue | undefined>(undefined);

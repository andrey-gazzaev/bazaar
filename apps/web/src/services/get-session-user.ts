import { cookies } from 'next/headers';
import { cache } from 'react';
import { readSessionUser } from '@/dtos/schemas/session/read-session-user';
import type { SessionUser } from '@/models';

/** Person from the user cookie for this request. Null when nobody is signed in. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();

  return readSessionUser(jar.get('bazaar_user')?.value ?? null);
});

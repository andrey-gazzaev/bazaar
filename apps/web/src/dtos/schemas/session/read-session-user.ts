import type { SessionUser } from '@/models';
import { mapUser } from '../../mappers/user/map-user';
import { userSchema } from '../user/user.schema';

/** Person stored in the user cookie. Null when the value is missing or unreadable. */
export function readSessionUser(raw: string | null): SessionUser | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return mapUser(userSchema.parse(parsed));
  } catch {
    return null;
  }
}

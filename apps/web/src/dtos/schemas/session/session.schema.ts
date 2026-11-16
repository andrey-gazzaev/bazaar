import { z } from 'zod';
import { userSchema } from '../user/user.schema';

/** Current session. user is null when nobody is signed in. */
export const sessionSchema = z.object({
  user: userSchema.nullable(),
});

/** Current session. user is null when nobody is signed in. */
export type SessionDto = z.infer<typeof sessionSchema>;

import { z } from 'zod';
import { userSchema } from './user.schema';

/** Account list payload. */
export const userListSchema = z.object({
  users: z.array(userSchema),
});

/** Account list payload. */
export type UserListDto = z.infer<typeof userListSchema>;

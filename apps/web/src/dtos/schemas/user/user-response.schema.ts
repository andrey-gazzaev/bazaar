import { z } from 'zod';
import { userSchema } from './user.schema';

/** One account payload. */
export const userResponseSchema = z.object({
  user: userSchema,
});

/** One account payload. */
export type UserResponseDto = z.infer<typeof userResponseSchema>;

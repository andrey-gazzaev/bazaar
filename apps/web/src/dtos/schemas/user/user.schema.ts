import { z } from 'zod';

/** Account payload from the API. */
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum(['ADMIN', 'SELLER', 'CLIENT']),
});

/** Account payload from the API. */
export type UserDto = z.infer<typeof userSchema>;

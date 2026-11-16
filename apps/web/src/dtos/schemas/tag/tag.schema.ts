import { z } from 'zod';

/** Tag payload from the API. */
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/** Tag payload from the API. */
export type TagDto = z.infer<typeof tagSchema>;

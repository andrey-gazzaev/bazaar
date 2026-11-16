import { z } from 'zod';
import { tagSchema } from './tag.schema';

/** One tag payload. */
export const tagResponseSchema = z.object({
  tag: tagSchema,
});

/** One tag payload. */
export type TagResponseDto = z.infer<typeof tagResponseSchema>;

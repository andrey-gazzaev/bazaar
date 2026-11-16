import { z } from 'zod';
import { tagSchema } from './tag.schema';

/** Tag catalog payload. */
export const tagListSchema = z.object({
  tags: z.array(tagSchema),
});

/** Tag catalog payload. */
export type TagListDto = z.infer<typeof tagListSchema>;

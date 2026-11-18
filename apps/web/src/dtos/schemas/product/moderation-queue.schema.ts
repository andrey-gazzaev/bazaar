import { z } from 'zod';
import { productSchema } from './product.schema';

/** Pending listings and how many are waiting. */
export const moderationQueueSchema = z.object({
  products: z.array(productSchema),
  count: z.number(),
});

/** Pending listings and how many are waiting. */
export type ModerationQueueDto = z.infer<typeof moderationQueueSchema>;

import { z } from 'zod';
import { tagSchema } from '../tag/tag.schema';

/** Listing payload from the API. */
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  sellerId: z.string(),
  sellerName: z.string(),
  images: z.array(z.string()),
  tags: z.array(tagSchema),
});

/** Listing payload from the API. */
export type ProductDto = z.infer<typeof productSchema>;

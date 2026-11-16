import { z } from 'zod';
import { productSchema } from './product.schema';

/** One page of the public catalog. */
export const catalogPageSchema = z.object({
  products: z.array(productSchema),
  page: z.number(),
  pageCount: z.number(),
  total: z.number(),
  ceiling: z.number(),
});

/** One page of the public catalog. */
export type CatalogPageDto = z.infer<typeof catalogPageSchema>;

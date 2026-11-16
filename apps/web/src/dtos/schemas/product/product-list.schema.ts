import { z } from 'zod';
import { productSchema } from './product.schema';

/** Catalog payload. */
export const productListSchema = z.object({
  products: z.array(productSchema),
});

/** Catalog payload. */
export type ProductListDto = z.infer<typeof productListSchema>;

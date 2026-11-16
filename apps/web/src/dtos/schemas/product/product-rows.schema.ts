import { z } from 'zod';
import { productSchema } from './product.schema';

/** List of listings without a page. */
export const productRowsSchema = z.object({
  products: z.array(productSchema),
});

/** List of listings without a page. */
export type ProductRowsDto = z.infer<typeof productRowsSchema>;

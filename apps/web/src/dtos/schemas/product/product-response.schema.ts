import { z } from 'zod';
import { productSchema } from './product.schema';

/** One listing payload. */
export const productResponseSchema = z.object({
  product: productSchema,
});

/** One listing payload. */
export type ProductResponseDto = z.infer<typeof productResponseSchema>;

import { z } from 'zod';

/** One cart line payload. */
export const cartLineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number(),
  stock: z.number(),
  available: z.boolean(),
});

/** One cart line payload. */
export type CartLineDto = z.infer<typeof cartLineSchema>;

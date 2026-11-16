import { z } from 'zod';
import { cartLineSchema } from './cart-line.schema';

/** Cart payload. */
export const cartSchema = z.object({
  lines: z.array(cartLineSchema),
});

/** Cart payload. */
export type CartDto = z.infer<typeof cartSchema>;

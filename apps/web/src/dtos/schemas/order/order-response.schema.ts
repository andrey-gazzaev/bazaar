import { z } from 'zod';
import { orderSchema } from './order.schema';

/** One order payload. */
export const orderResponseSchema = z.object({
  order: orderSchema,
});

/** One order payload. */
export type OrderResponseDto = z.infer<typeof orderResponseSchema>;

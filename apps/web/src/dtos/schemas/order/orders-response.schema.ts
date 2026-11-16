import { z } from 'zod';
import { orderSchema } from './order.schema';

/** Orders written by one checkout. */
export const ordersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

/** Orders written by one checkout. */
export type OrdersResponseDto = z.infer<typeof ordersResponseSchema>;

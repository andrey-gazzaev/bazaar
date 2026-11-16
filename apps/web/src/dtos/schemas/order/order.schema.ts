import { z } from 'zod';

/** Paid order payload. */
export const orderSchema = z.object({
  id: z.string(),
  price: z.number(),
  productId: z.string(),
  productName: z.string(),
  recipientName: z.string(),
  phone: z.string(),
  address: z.string(),
});

/** Paid order payload. */
export type OrderDto = z.infer<typeof orderSchema>;

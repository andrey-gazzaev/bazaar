import type { Order, Shipping } from '@/models';
import { api } from '../../http';
import { mapOrder } from '../../mappers/order/map-order';
import { ordersResponseSchema } from '../../schemas/order/orders-response.schema';

/** Mock checkout of the cart. */
export class OrderApi {
  /** Buys the cart and stores one paid order per line. */
  public async create(shipping: Shipping): Promise<readonly Order[]> {
    const { data } = await api.post('/api/orders', shipping);

    return ordersResponseSchema.parse(data).orders.map(mapOrder);
  }
}

/** Shared checkout client. */
export const orderApi = new OrderApi();

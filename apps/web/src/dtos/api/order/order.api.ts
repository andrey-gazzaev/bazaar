import type { Order, Shipping } from '@/models';
import { api } from '../../http';
import { mapOrder } from '../../mappers/order/map-order';
import { orderResponseSchema } from '../../schemas/order/order-response.schema';

/** Mock checkout. */
export class OrderApi {
  /** Buys one listing and stores it as paid. */
  public async create(productId: string, shipping: Shipping): Promise<Order> {
    const { data } = await api.post('/api/orders', { productId, ...shipping });
    return mapOrder(orderResponseSchema.parse(data).order);
  }
}

/** Shared checkout client. */
export const orderApi = new OrderApi();

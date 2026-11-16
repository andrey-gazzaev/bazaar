import type { Order } from '@/models';
import type { OrderDto } from '../../schemas/order/order.schema';

/** Paid order stored for the shop. */
export function mapOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    price: dto.price,
    productId: dto.productId,
    productName: dto.productName,
    recipientName: dto.recipientName,
    phone: dto.phone,
    address: dto.address,
  };
}

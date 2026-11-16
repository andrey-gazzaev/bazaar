import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import type { PublicUser } from '../common/public-user';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './order.dto';

/** Mock purchases. Confirming the cart stores one paid order per line. */
@Injectable()
export class OrdersService {
  /** Takes stock and stores the orders. */
  public constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ProductsService) private readonly products: ProductsService,
  ) {}

  /** Charges each cart line for the confirmed amount and clears the cart. */
  public async create(buyer: PublicUser, dto: CreateOrderDto): Promise<readonly OrderDto[]> {
    if (buyer.role === Role.ADMIN) throw new ForbiddenException('Покупка доступна клиентам и продавцам');

    return this.prisma.$transaction(async (tx) => {
      const lines = await tx.cartItem.findMany({
        where: { userId: buyer.id },
        orderBy: { id: 'asc' },
      });

      if (lines.length === 0) throw new BadRequestException('Корзина пуста');

      const orders: OrderDto[] = [];

      for (const line of lines) {
        const taken = await this.products.take(tx, line.productId, line.quantity);
        const order = await tx.order.create({
          data: {
            productId: taken.id,
            buyerId: buyer.id,
            price: taken.price * line.quantity,
            recipientName: dto.recipientName.trim(),
            phone: dto.phone.trim(),
            address: dto.address.trim(),
            status: OrderStatus.PAID,
          },
        });

        orders.push({
          id: order.id,
          price: order.price,
          productId: taken.id,
          productName: taken.name,
          recipientName: order.recipientName,
          phone: order.phone,
          address: order.address,
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: buyer.id } });

      return orders;
    });
  }
}

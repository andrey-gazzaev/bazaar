import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import type { PublicUser } from '../common/public-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './order.dto';

/** Mock purchases. Confirming an order stores it as paid. */
@Injectable()
export class OrdersService {
  /** Reads the listing price and stores the order. */
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Buys one listing at its current price and stores the delivery details. */
  public async create(buyer: PublicUser, dto: CreateOrderDto): Promise<OrderDto> {
    if (buyer.role === Role.ADMIN) throw new ForbiddenException('Покупка доступна клиентам и продавцам');

    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });

    if (!product) throw new NotFoundException('Товар не найден');

    const order = await this.prisma.order.create({
      data: {
        productId: product.id,
        buyerId: buyer.id,
        price: product.price,
        recipientName: dto.recipientName.trim(),
        phone: dto.phone.trim(),
        address: dto.address.trim(),
        status: OrderStatus.PAID,
      },
    });

    return {
      id: order.id,
      price: order.price,
      productId: product.id,
      productName: product.name,
      recipientName: order.recipientName,
      phone: order.phone,
      address: order.address,
    };
  }
}

import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewStatus, Role } from '@prisma/client';
import type { PublicUser } from '../common/public-user';
import { PrismaService } from '../prisma/prisma.service';
import { CartLineDto } from './cart.dto';

/** A buyer's cart. Quantities are not a reservation. */
@Injectable()
export class CartService {
  /** Reads cart lines and the listings they point at. */
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Lines in the signed-in person's cart. Empty when there are none. */
  public async list(buyer: PublicUser): Promise<readonly CartLineDto[]> {
    this.assertBuyer(buyer);

    const items = await this.prisma.cartItem.findMany({
      where: { userId: buyer.id },
      include: { product: { include: { images: { orderBy: { sort: 'asc' } } } } },
      orderBy: { id: 'asc' },
    });

    return items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0]?.url ?? '',
      quantity: item.quantity,
      stock: item.product.stock,
      available: item.product.status === ReviewStatus.APPROVED && item.quantity <= item.product.stock,
    }));
  }

  /** Sets how many units of an approved listing the cart holds. */
  public async set(buyer: PublicUser, productId: string, quantity: number): Promise<void> {
    this.assertBuyer(buyer);

    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product || product.status !== ReviewStatus.APPROVED) throw new NotFoundException('Товар не найден');
    if (quantity > product.stock) throw new BadRequestException('Недостаточно товара');

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId: buyer.id, productId } },
      create: { userId: buyer.id, productId, quantity },
      update: { quantity },
    });
  }

  /** Drops one listing from the cart. */
  public async remove(buyer: PublicUser, productId: string): Promise<void> {
    this.assertBuyer(buyer);

    await this.prisma.cartItem.deleteMany({ where: { userId: buyer.id, productId } });
  }

  private assertBuyer(buyer: PublicUser): void {
    if (buyer.role === Role.ADMIN) throw new ForbiddenException('Покупка доступна клиентам и продавцам');
  }
}

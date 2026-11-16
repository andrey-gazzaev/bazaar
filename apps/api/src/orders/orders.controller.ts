import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicUser } from '../common/public-user';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './order.dto';
import { OrdersService } from './orders.service';

/** Mock checkout of the cart. */
@Controller('orders')
export class OrdersController {
  /** Stores one paid order per cart line. */
  public constructor(@Inject(OrdersService) private readonly orders: OrdersService) {}

  /** Buys the cart after the buyer has filled in delivery. */
  @Post()
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  public async create(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateOrderDto,
  ): Promise<{ orders: readonly OrderDto[] }> {
    return { orders: await this.orders.create(user, dto) };
  }
}

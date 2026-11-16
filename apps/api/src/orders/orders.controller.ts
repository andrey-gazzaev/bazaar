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

/** Mock checkout. */
@Controller('orders')
export class OrdersController {
  /** Stores a paid order. */
  public constructor(@Inject(OrdersService) private readonly orders: OrdersService) {}

  /** Buys one listing after the buyer has filled in delivery. */
  @Post()
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  public async create(@CurrentUser() user: PublicUser, @Body() dto: CreateOrderDto): Promise<{ order: OrderDto }> {
    return { order: await this.orders.create(user, dto) };
  }
}

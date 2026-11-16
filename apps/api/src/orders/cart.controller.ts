import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicUser } from '../common/public-user';
import { CartLineDto } from './cart.dto';
import { CartService } from './cart.service';
import { CartQuantityDto } from './dto/cart-quantity.dto';

/** Cart for a client or a seller. */
@Controller('cart')
export class CartController {
  /** Reads and changes cart lines. */
  public constructor(@Inject(CartService) private readonly cart: CartService) {}

  /** Lines in the signed-in person's cart. */
  @Get()
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  public async list(@CurrentUser() user: PublicUser): Promise<{ lines: readonly CartLineDto[] }> {
    return { lines: await this.cart.list(user) };
  }

  /** Sets the quantity of one approved listing. */
  @Put(':productId')
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async set(
    @CurrentUser() user: PublicUser,
    @Param('productId') productId: string,
    @Body() dto: CartQuantityDto,
  ): Promise<void> {
    await this.cart.set(user, productId, dto.quantity);
  }

  /** Drops one listing from the cart. */
  @Delete(':productId')
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@CurrentUser() user: PublicUser, @Param('productId') productId: string): Promise<void> {
    await this.cart.remove(user, productId);
  }
}

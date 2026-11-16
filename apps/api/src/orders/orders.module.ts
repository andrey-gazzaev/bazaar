import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

/** Cart and mock purchases. */
@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [CartController, OrdersController],
  providers: [CartService, OrdersService],
})
export class OrdersModule {}

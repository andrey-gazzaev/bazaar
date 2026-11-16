import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

/** Shop API. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TagsModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}

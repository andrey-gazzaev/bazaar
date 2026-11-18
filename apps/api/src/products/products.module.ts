import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PendingMailModule } from '../pending-mail/pending-mail.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

/** Listing catalog. */
@Module({
  imports: [AuthModule, PendingMailModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

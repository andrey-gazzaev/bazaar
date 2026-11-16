import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicUser } from '../common/public-user';
import { CreateProductDto } from './dto/create-product.dto';
import { imageUpload } from './image-upload';
import { ProductDto } from './product.dto';
import { ProductsService } from './products.service';

/** Public catalog and a seller's own listings. */
@Controller('products')
export class ProductsController {
  /** Reads and changes listings. */
  public constructor(@Inject(ProductsService) private readonly products: ProductsService) {}

  /** Newest listings. */
  @Get()
  public async list(): Promise<{ products: readonly ProductDto[] }> {
    return { products: await this.products.list() };
  }

  /** One listing. */
  @Get(':id')
  public async get(@Param('id') id: string): Promise<{ product: ProductDto }> {
    return { product: await this.products.get(id) };
  }

  /** Adds a listing for the signed-in seller. */
  @Post()
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(imageUpload)
  public async create(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ): Promise<{ product: ProductDto }> {
    return { product: await this.products.create(user, dto, files ?? []) };
  }

  /** Removes a listing the seller owns. */
  @Delete(':id')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@CurrentUser() user: PublicUser, @Param('id') id: string): Promise<void> {
    await this.products.remove(user, id);
  }
}

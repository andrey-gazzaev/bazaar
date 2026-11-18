import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { OptionalUser } from '../auth/optional-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicUser } from '../common/public-user';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQuery } from './dto/list-products.query';
import { UpdateProductDto } from './dto/update-product.dto';
import { imageUpload } from './image-upload';
import { ModerationQueueDto, ProductDto, ProductPageDto } from './product.dto';
import { ProductsService } from './products.service';

/** Public catalog, a seller's own listings, and the admin queue. */
@Controller('products')
export class ProductsController {
  /** Reads and changes listings. */
  public constructor(@Inject(ProductsService) private readonly products: ProductsService) {}

  /** One page of approved listings. */
  @Get()
  public async list(@Query() query: ListProductsQuery): Promise<ProductPageDto> {
    return this.products.list(query);
  }

  /** Every listing of the signed-in seller. */
  @Get('mine')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  public async mine(@CurrentUser() user: PublicUser): Promise<{ products: readonly ProductDto[] }> {
    return { products: await this.products.mine(user) };
  }

  /** Listings waiting for an admin, and how many there are. */
  @Get('moderation')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  public async moderation(): Promise<ModerationQueueDto> {
    return this.products.moderation();
  }

  /** One listing. A hidden card is returned only to its seller or an admin. */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  public async get(
    @Param('id') id: string,
    @OptionalUser() viewer: PublicUser | null,
  ): Promise<{ product: ProductDto }> {
    return { product: await this.products.get(id, viewer) };
  }

  /** Adds a pending listing for the signed-in seller. */
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

  /** Changes a listing the seller owns. */
  @Patch(':id')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(imageUpload)
  public async update(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ): Promise<{ product: ProductDto }> {
    return { product: await this.products.update(user, id, dto, files ?? []) };
  }

  /** Makes one pending listing public. */
  @Post(':id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  public async approve(@Param('id') id: string): Promise<{ product: ProductDto }> {
    return { product: await this.products.approve(id) };
  }

  /** Keeps one pending listing hidden. */
  @Post(':id/reject')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  public async reject(@Param('id') id: string): Promise<{ product: ProductDto }> {
    return { product: await this.products.reject(id) };
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

import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { unlink } from 'node:fs/promises';
import type { PublicUser } from '../common/public-user';
import { rethrowPrisma } from '../common/prisma-error';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './product.dto';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const productInclude = {
  seller: true,
  images: { orderBy: { sort: 'asc' as const } },
  tags: { include: { tag: true } },
} satisfies Prisma.ProductInclude;

type ProductRecord = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/** Catalog of listings. */
@Injectable()
export class ProductsService {
  /** Reads listings and the pictures saved for them. */
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Newest listings first. */
  public async list(): Promise<readonly ProductDto[]> {
    const products = await this.prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => this.toProduct(product));
  }

  /** One listing, or an error when it is gone. */
  public async get(id: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });

    if (!product) throw new NotFoundException('Товар не найден');

    return this.toProduct(product);
  }

  /** Stores a listing for the signed-in seller. */
  public async create(
    seller: PublicUser,
    dto: CreateProductDto,
    files: readonly Express.Multer.File[],
  ): Promise<ProductDto> {
    await this.assertImages(files);

    const tagIds = [...new Set(dto.tagIds)];

    if (tagIds.length > 0) {
      const found = await this.prisma.tag.count({ where: { id: { in: tagIds } } });

      if (found !== tagIds.length) {
        await this.removeFiles(files);
        throw new BadRequestException('Неизвестный тег');
      }
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          sellerId: seller.id,
          name: dto.name.trim(),
          description: dto.description.trim(),
          price: dto.price,
          images: {
            create: files.map((file, sort) => ({ url: `/uploads/${file.filename}`, sort })),
          },
          tags: {
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
        include: productInclude,
      });

      return this.toProduct(product);
    } catch (error) {
      await this.removeFiles(files);
      rethrowPrisma(error, { conflict: 'Не удалось сохранить товар' });
    }
  }

  /** Deletes a listing the seller owns, including its pictures. */
  public async remove(actor: PublicUser, productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) throw new NotFoundException('Товар не найден');
    if (product.sellerId !== actor.id) throw new ForbiddenException('Можно удалить только свой товар');

    await this.prisma.product.delete({ where: { id: productId } });
    await this.removeFiles(product.images.map((image) => ({ path: this.pathFor(image.url) })));
  }

  private async assertImages(files: readonly Express.Multer.File[]): Promise<void> {
    if (files.length === 0) throw new BadRequestException('Добавьте хотя бы одну картинку');

    const invalid = files.some((file) => !allowedTypes.has(file.mimetype));

    if (!invalid) return;

    await this.removeFiles(files);
    throw new BadRequestException('Нужна картинка JPEG, PNG или WebP');
  }

  private pathFor(url: string): string {
    const directory = process.env.UPLOAD_DIR || 'uploads';
    return `${directory}/${url.replace('/uploads/', '')}`;
  }

  private async removeFiles(files: readonly { path: string }[]): Promise<void> {
    await Promise.all(files.map((file) => unlink(file.path).catch(() => undefined)));
  }

  private toProduct(product: ProductRecord): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sellerId: product.sellerId,
      sellerName: product.seller.name,
      images: product.images.map((image) => image.url),
      tags: product.tags.map((link) => ({ id: link.tag.id, name: link.tag.name })),
    };
  }
}

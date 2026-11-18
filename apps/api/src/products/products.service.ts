import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReviewStatus, Role } from '@prisma/client';
import { unlink } from 'node:fs/promises';
import type { PublicUser } from '../common/public-user';
import { rethrowPrisma } from '../common/prisma-error';
import { PendingMail } from '../pending-mail/pending-mail';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQuery, ProductSort } from './dto/list-products.query';
import { UpdateProductDto } from './dto/update-product.dto';
import { ModerationQueueDto, ProductDto, ProductPageDto } from './product.dto';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const pageSize = 12;

const productInclude = {
  seller: true,
  images: { orderBy: { sort: 'asc' as const } },
  tags: { include: { tag: true } },
} satisfies Prisma.ProductInclude;

type ProductRecord = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/** Listing kept after stock is taken. */
type TakenProduct = {
  readonly id: string;
  readonly name: string;
  readonly price: number;
};

/** Catalog of listings. */
@Injectable()
export class ProductsService {
  /** Reads listings and tells admins when one is newly pending. */
  public constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PendingMail) private readonly pendingMail: PendingMail,
  ) {}

  /** One page of approved listings. Stock of zero stays included. */
  public async list(query: ListProductsQuery): Promise<ProductPageDto> {
    const where = this.whereFor(query);
    const page = query.page ?? 1;

    const [total, rows, highest] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: orderBy(query.sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.aggregate({
        where: { status: ReviewStatus.APPROVED },
        _max: { price: true },
      }),
    ]);

    return {
      products: rows.map((product) => this.toProduct(product)),
      page,
      pageCount: total === 0 ? 0 : Math.ceil(total / pageSize),
      total,
      ceiling: highest._max.price ?? 0,
    };
  }

  /** One listing. A hidden card is returned only to its seller or an admin. */
  public async get(id: string, viewer: PublicUser | null): Promise<ProductDto> {
    const product = await this.find(id);
    const allowed =
      product.status === ReviewStatus.APPROVED || viewer?.role === Role.ADMIN || viewer?.id === product.sellerId;

    if (!allowed) throw new NotFoundException('Товар не найден');

    return this.toProduct(product);
  }

  /** Every listing of one seller, including hidden ones. */
  public async mine(seller: PublicUser): Promise<readonly ProductDto[]> {
    const products = await this.prisma.product.findMany({
      where: { sellerId: seller.id },
      include: productInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    return products.map((product) => this.toProduct(product));
  }

  /** Listings waiting for an admin, and how many there are. */
  public async moderation(): Promise<ModerationQueueDto> {
    const products = await this.prisma.product.findMany({
      where: { status: ReviewStatus.PENDING },
      include: productInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const pending = products.map((product) => this.toProduct(product));

    return { products: pending, count: pending.length };
  }

  /** Stores a listing for the signed-in seller and leaves it pending. */
  public async create(
    seller: PublicUser,
    dto: CreateProductDto,
    files: readonly Express.Multer.File[],
  ): Promise<ProductDto> {
    await this.assertImages(files, true);

    const tagIds = uniqueIds(dto.tagIds);

    await this.assertTags(tagIds, files);

    try {
      const product = await this.prisma.product.create({
        data: {
          sellerId: seller.id,
          name: dto.name.trim(),
          description: dto.description.trim(),
          price: dto.price,
          stock: dto.stock,
          status: ReviewStatus.PENDING,
          images: {
            create: files.map((file, sort) => ({ url: `/uploads/${file.filename}`, sort })),
          },
          tags: {
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
        include: productInclude,
      });

      await this.pendingMail.publish({
        productId: product.id,
        name: product.name,
        sellerId: product.sellerId,
      });

      return this.toProduct(product);
    } catch (error) {
      await this.removeFiles(files);
      rethrowPrisma(error, { conflict: 'Не удалось сохранить товар' });
    }
  }

  /** Changes a listing the seller owns. A rejected card returns to pending. */
  public async update(
    actor: PublicUser,
    productId: string,
    dto: UpdateProductDto,
    files: readonly Express.Multer.File[],
  ): Promise<ProductDto> {
    const current = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!current) {
      await this.removeFiles(files);
      throw new NotFoundException('Товар не найден');
    }

    if (current.sellerId !== actor.id) {
      await this.removeFiles(files);
      throw new ForbiddenException('Можно изменить только свой товар');
    }

    await this.assertImages(files, false);

    const tagIds = uniqueIds(dto.tagIds);

    await this.assertTags(tagIds, files);

    const wasRejected = current.status === ReviewStatus.REJECTED;
    const status = wasRejected ? ReviewStatus.PENDING : current.status;

    try {
      const product = await this.prisma.product.update({
        where: { id: productId },
        data: {
          name: dto.name.trim(),
          description: dto.description.trim(),
          price: dto.price,
          stock: dto.stock,
          status,
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
          ...(files.length > 0
            ? {
                images: {
                  deleteMany: {},
                  create: files.map((file, sort) => ({ url: `/uploads/${file.filename}`, sort })),
                },
              }
            : {}),
        },
        include: productInclude,
      });

      if (wasRejected) {
        await this.pendingMail.publish({
          productId: product.id,
          name: product.name,
          sellerId: product.sellerId,
        });
      }

      if (files.length > 0) {
        await this.removeFiles(current.images.map((image) => ({ path: this.pathFor(image.url) })));
      }

      return this.toProduct(product);
    } catch (error) {
      await this.removeFiles(files);
      rethrowPrisma(error, { conflict: 'Не удалось сохранить товар', missing: 'Товар не найден' });
    }
  }

  /** Makes a pending listing public. */
  public async approve(productId: string): Promise<ProductDto> {
    return this.review(productId, ReviewStatus.APPROVED);
  }

  /** Keeps a pending listing hidden. */
  public async reject(productId: string): Promise<ProductDto> {
    return this.review(productId, ReviewStatus.REJECTED);
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

  /** Decrements stock when the listing is still approved and enough units remain. */
  public async take(tx: Prisma.TransactionClient, productId: string, quantity: number): Promise<TakenProduct> {
    const updated = await tx.product.updateMany({
      where: {
        id: productId,
        status: ReviewStatus.APPROVED,
        stock: { gte: quantity },
      },
      data: { stock: { decrement: quantity } },
    });

    if (updated.count === 1) {
      const product = await tx.product.findUniqueOrThrow({ where: { id: productId } });

      return { id: product.id, name: product.name, price: product.price };
    }

    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product || product.status !== ReviewStatus.APPROVED) throw new NotFoundException('Товар не найден');

    throw new BadRequestException('Недостаточно товара');
  }

  private async review(productId: string, status: ReviewStatus): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new NotFoundException('Товар не найден');
    if (product.status !== ReviewStatus.PENDING) throw new BadRequestException('Товар не на модерации');

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { status },
      include: productInclude,
    });

    return this.toProduct(updated);
  }

  private whereFor(query: ListProductsQuery): Prisma.ProductWhereInput {
    const q = query.q?.trim();
    const tag = query.tag?.trim();

    return {
      status: ReviewStatus.APPROVED,
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      ...(tag ? { tags: { some: { tag: { name: tag } } } } : {}),
      ...(query.maxPrice !== undefined ? { price: { lte: query.maxPrice } } : {}),
    };
  }

  private async find(id: string): Promise<ProductRecord> {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });

    if (!product) throw new NotFoundException('Товар не найден');

    return product;
  }

  private async assertTags(tagIds: readonly string[], files: readonly Express.Multer.File[]): Promise<void> {
    if (tagIds.length === 0) return;

    const found = await this.prisma.tag.count({ where: { id: { in: [...tagIds] } } });

    if (found === tagIds.length) return;

    await this.removeFiles(files);
    throw new BadRequestException('Неизвестный тег');
  }

  private async assertImages(files: readonly Express.Multer.File[], required: boolean): Promise<void> {
    if (required && files.length === 0) throw new BadRequestException('Добавьте хотя бы одну картинку');

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
      stock: product.stock,
      status: product.status,
      sellerId: product.sellerId,
      sellerName: product.seller.name,
      images: product.images.map((image) => image.url),
      tags: product.tags.map((link) => ({ id: link.tag.id, name: link.tag.name })),
    };
  }
}

function orderBy(sort: ProductSort | undefined): Prisma.ProductOrderByWithRelationInput[] {
  const newest: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: 'desc' }, { id: 'desc' }];

  if (sort === 'price_asc') return [{ price: 'asc' }, ...newest];
  if (sort === 'price_desc') return [{ price: 'desc' }, ...newest];
  if (sort === 'name') return [{ name: 'asc' }, ...newest];

  return newest;
}

function uniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

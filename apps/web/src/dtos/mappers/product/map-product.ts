import type { Product } from '@/models';
import type { ProductDto } from '../../schemas/product/product.schema';
import { mapTag } from '../tag/map-tag';

/** Listing stored for the shop. */
export function mapProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    stock: dto.stock,
    status: dto.status,
    sellerId: dto.sellerId,
    sellerName: dto.sellerName,
    images: dto.images,
    tags: dto.tags.map(mapTag),
  };
}

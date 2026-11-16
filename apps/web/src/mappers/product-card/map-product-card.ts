import type { Product } from '@/models';
import { formatPrice } from '@/services';
import type { ProductCardVm } from '@/view-models';

/** Card shape for one listing. */
export function mapProductCard(product: Product): ProductCardVm {
  return {
    id: product.id,
    name: product.name,
    priceLabel: formatPrice(product.price),
    image: product.images[0] ?? '',
    sellerName: product.sellerName,
    tags: product.tags.map((tag) => tag.name),
  };
}

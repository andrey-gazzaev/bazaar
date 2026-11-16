import type { Product } from '@/models';
import { formatPrice, formatStock } from '@/services';
import type { ProductCardVm } from '@/view-models';

/** Card shape for one listing. */
export function mapProductCard(product: Product): ProductCardVm {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    priceLabel: formatPrice(product.price),
    stock: product.stock,
    stockLabel: formatStock(product.stock),
    image: product.images[0] ?? '',
    sellerName: product.sellerName,
    tags: product.tags.map((tag) => tag.name),
  };
}

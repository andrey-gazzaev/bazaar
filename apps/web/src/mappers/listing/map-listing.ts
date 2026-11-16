import type { Product } from '@/models';
import { formatPrice, formatReviewStatus, formatStock } from '@/services';
import type { ListingVm } from '@/view-models';

/** Seller row for one listing. */
export function mapListing(product: Product): ListingVm {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    priceLabel: formatPrice(product.price),
    stock: product.stock,
    stockLabel: formatStock(product.stock),
    statusLabel: formatReviewStatus(product.status),
    tagIds: product.tags.map((tag) => tag.id),
    image: product.images[0] ?? '',
  };
}

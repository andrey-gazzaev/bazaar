import type { Product } from '@/models';
import { formatPrice } from '@/services';
import type { ModerationItemVm } from '@/view-models';

/** Queue row for one pending listing. */
export function mapModerationItem(product: Product): ModerationItemVm {
  return {
    id: product.id,
    name: product.name,
    sellerName: product.sellerName,
    priceLabel: formatPrice(product.price),
    image: product.images[0] ?? '',
  };
}

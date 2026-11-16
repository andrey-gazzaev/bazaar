import type { Product } from '@/models';
import { formatPrice } from '@/services';
import type { CheckoutVm } from '@/view-models';

/** Confirmation shape for buying one listing. The total is its price. */
export function buildCheckout(product: Product): CheckoutVm {
  return {
    productId: product.id,
    productName: product.name,
    image: product.images[0] ?? '',
    totalLabel: formatPrice(product.price),
  };
}

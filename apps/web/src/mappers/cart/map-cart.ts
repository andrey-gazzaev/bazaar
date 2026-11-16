import type { CartLine } from '@/models';
import { formatPrice } from '@/services';
import type { CartVm } from '@/view-models';
import { mapCartLine } from '../cart-line/map-cart-line';

/** Cart ready for the checkout screen. Delivery is free. */
export function mapCart(lines: readonly CartLine[]): CartVm {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const cards = lines.map(mapCartLine);

  return {
    lines: cards,
    totalLabel: formatPrice(total),
    deliveryLabel: formatPrice(0),
    empty: lines.length === 0,
    ready: lines.length > 0 && cards.every((line) => line.available),
  };
}

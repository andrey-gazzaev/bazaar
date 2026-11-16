import type { CartLine } from '@/models';
import { formatPrice } from '@/services';
import type { CartLineVm } from '@/view-models';

/** One cart line ready to show. */
export function mapCartLine(line: CartLine): CartLineVm {
  return {
    productId: line.productId,
    name: line.name,
    image: line.image,
    quantity: line.quantity,
    stock: line.stock,
    available: line.available,
    note: lineNote(line),
    lineLabel: formatPrice(line.price * line.quantity),
  };
}

function lineNote(line: CartLine): string {
  if (line.available) return '';

  if (line.quantity > line.stock) return 'Недостаточно товара';

  return 'Товар не найден';
}

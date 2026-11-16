import type { CartLine } from '@/models';
import type { CartLineDto } from '../../schemas/cart/cart-line.schema';

/** Cart line stored for the shop. */
export function mapCartLine(dto: CartLineDto): CartLine {
  return {
    productId: dto.productId,
    name: dto.name,
    price: dto.price,
    image: dto.image,
    quantity: dto.quantity,
    stock: dto.stock,
    available: dto.available,
  };
}

/** Cart lines stored for the shop. */
export function mapCartLines(lines: readonly CartLineDto[]): readonly CartLine[] {
  return lines.map(mapCartLine);
}

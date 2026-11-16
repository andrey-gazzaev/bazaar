import type { CartLine } from '@/models';
import { api } from '../../http';
import { mapCartLines } from '../../mappers/cart/map-cart-line';
import { cartSchema } from '../../schemas/cart/cart.schema';

/** Cart for a client or a seller. */
export class CartApi {
  /** Lines in the signed-in person's cart. */
  public async list(): Promise<readonly CartLine[]> {
    const { data } = await api.get('/api/cart');

    return mapCartLines(cartSchema.parse(data).lines);
  }

  /** Sets the quantity of one approved listing. */
  public async setItem(productId: string, quantity: number): Promise<void> {
    await api.put(`/api/cart/${productId}`, { quantity });
  }

  /** Drops one listing from the cart. */
  public async remove(productId: string): Promise<void> {
    await api.delete(`/api/cart/${productId}`);
  }
}

/** Shared cart client. */
export const cartApi = new CartApi();

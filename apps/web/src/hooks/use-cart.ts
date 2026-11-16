import type { Order, Shipping } from '@/models';
import { mapCart } from '@/mappers';
import { useCartLines, useCheckout, useRemoveCartItem, useSetCartItem } from '@/queries';
import type { CartVm } from '@/view-models';

/** Cart, its quantity changes, and checkout. `cart` is null until the lines have loaded. */
export function useCart(): {
  readonly cart: CartVm | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly isSaving: boolean;
  readonly isCheckingOut: boolean;
  readonly setCartItem: (input: { productId: string; quantity: number }) => Promise<void>;
  readonly removeCartItem: (productId: string) => Promise<void>;
  readonly checkout: (shipping: Shipping) => Promise<readonly Order[]>;
} {
  const lines = useCartLines();
  const setItem = useSetCartItem();
  const removeItem = useRemoveCartItem();
  const place = useCheckout();

  const cart = lines.data ? mapCart(lines.data) : null;

  return {
    cart,
    isLoading: lines.isLoading,
    error: lines.error,
    isSaving: setItem.isPending || removeItem.isPending,
    isCheckingOut: place.isPending,
    setCartItem: (input) => setItem.mutateAsync(input),
    removeCartItem: (productId) => removeItem.mutateAsync(productId),
    checkout: (shipping) => place.mutateAsync(shipping),
  };
}

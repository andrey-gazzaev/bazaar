import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { cartKeys } from '../keys';

/** Drops one cart line and refreshes the cart. */
export function useRemoveCartItem() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.remove(productId),
    onSuccess: () => client.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

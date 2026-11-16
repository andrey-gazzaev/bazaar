import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { cartKeys } from '../keys';

/** Sets one cart line and refreshes the cart. */
export function useSetCartItem() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { productId: string; quantity: number }) => cartApi.setItem(input.productId, input.quantity),
    onSuccess: () => client.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/dtos/api/order/order.api';
import type { Shipping } from '@/models';
import { cartKeys } from '../../cart/keys';
import { productKeys } from '../../products/keys';

/** Buys the cart and refreshes the catalog. */
export function useCheckout() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (shipping: Shipping) => orderApi.create(shipping),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: cartKeys.all });
      client.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

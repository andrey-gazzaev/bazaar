import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { cartKeys } from '../keys';

/** Cart lines for a client or a seller. Guests and admins are not loaded. */
export function useCartLines(canShop: boolean) {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => cartApi.list(),
    retry: false,
    enabled: canShop,
  });
}

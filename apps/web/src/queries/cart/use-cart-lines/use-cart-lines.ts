import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { useSession } from '../../session/use-session/use-session';
import { cartKeys } from '../keys';

/** Cart lines for a client or a seller. Guests and admins are not loaded. */
export function useCartLines() {
  const session = useSession();

  const canShop = session.data?.role === 'CLIENT' || session.data?.role === 'SELLER';

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => cartApi.list(),
    retry: false,
    enabled: canShop,
  });
}

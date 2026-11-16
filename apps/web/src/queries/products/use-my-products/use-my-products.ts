import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Listings of the signed-in seller. */
export function useMyProducts() {
  return useQuery({
    queryKey: productKeys.mine(),
    queryFn: () => productApi.mine(),
  });
}

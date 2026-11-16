import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Newest listings. */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: () => productApi.list(),
  });
}

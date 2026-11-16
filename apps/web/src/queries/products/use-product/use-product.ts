import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** One listing. */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.load(id),
  });
}

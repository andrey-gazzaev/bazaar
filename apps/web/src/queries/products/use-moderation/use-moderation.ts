import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Listings waiting for an admin. */
export function useModeration() {
  return useQuery({
    queryKey: productKeys.moderation(),
    queryFn: () => productApi.moderation(),
  });
}

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Pending listings and how many are waiting. */
export function useModeration({
  enabled,
  live,
}: {
  /** When false, the queue is not requested. */
  readonly enabled: boolean;

  /** When true, an open tab asks again every 5 seconds. */
  readonly live: boolean;
}) {
  return useQuery({
    queryKey: productKeys.moderation(),
    queryFn: () => productApi.moderation(),
    enabled,
    refetchInterval: live ? 5000 : false,
  });
}

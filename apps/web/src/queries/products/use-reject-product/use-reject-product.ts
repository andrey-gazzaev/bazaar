import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Hides a listing and refreshes the queue. */
export function useRejectProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.reject(id),
    onSuccess: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}

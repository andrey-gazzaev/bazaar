import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Makes a listing public and refreshes the queue. */
export function useApproveProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.approve(id),
    onSuccess: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}

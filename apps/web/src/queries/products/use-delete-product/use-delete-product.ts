import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import { productKeys } from '../keys';

/** Removes a listing and refreshes the catalog. */
export function useDeleteProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}

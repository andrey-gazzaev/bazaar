import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import type { ProductPatch } from '@/models';
import { productKeys } from '../keys';

/** Changes a listing and refreshes the catalog. */
export function useUpdateProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; patch: ProductPatch }) => productApi.update(input.id, input.patch),
    onSuccess: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}

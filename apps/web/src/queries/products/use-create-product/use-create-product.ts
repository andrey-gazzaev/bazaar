import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import type { NewProduct } from '@/models';
import { productKeys } from '../keys';

/** Publishes a listing and refreshes the catalog. */
export function useCreateProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: NewProduct) => productApi.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: productKeys.all }),
  });
}

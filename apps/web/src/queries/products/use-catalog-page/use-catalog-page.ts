import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productApi } from '@/dtos/api/product/product.api';
import type { CatalogQuery } from '@/models';
import { productKeys } from '../keys';

/** One page of the public catalog. */
export function useCatalogPage(query: CatalogQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productApi.list(query),
    placeholderData: keepPreviousData,
  });
}

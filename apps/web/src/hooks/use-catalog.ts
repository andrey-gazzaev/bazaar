import type { CatalogQuery } from '@/models';
import { mapCatalogPage } from '@/mappers';
import { useCatalogPage } from '@/queries';

/** Catalog cards for the address filters. */
export function useCatalog(query: CatalogQuery) {
  const result = useCatalogPage(query);
  const page = result.data ? mapCatalogPage(result.data) : null;

  return {
    cards: page?.cards ?? [],
    page: page?.page ?? query.page,
    pageCount: page?.pageCount ?? 0,
    total: page?.total ?? 0,
    ceiling: page?.ceiling ?? 0,
    isLoading: result.isLoading,
    error: result.error,
  };
}

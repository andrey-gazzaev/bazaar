import type { CatalogQuery } from '@/models';

/** Cache keys for listings. */
export const productKeys = {
  all: ['products'] as const,
  list: (query: CatalogQuery) => [...productKeys.all, 'catalog', query] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  mine: () => [...productKeys.all, 'mine'] as const,
  moderation: () => [...productKeys.all, 'moderation'] as const,
};

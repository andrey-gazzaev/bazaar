'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { CatalogQuery } from '@/models';
import { catalogHref, catalogQueryFromSearchParams } from './catalog-query';

/** Catalog filters stored in the address. */
export function useCatalogAddress() {
  const params = useSearchParams();
  const router = useRouter();

  const query = catalogQueryFromSearchParams(params);

  function replace(next: CatalogQuery) {
    router.replace(catalogHref(next));
  }

  return { query, replace };
}

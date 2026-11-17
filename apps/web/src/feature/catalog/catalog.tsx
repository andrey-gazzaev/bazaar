'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { memo } from 'react';
import type { CatalogQuery } from '@/models';
import { useCatalog } from '@/hooks';
import { useTags } from '@/queries';
import { Page } from '@/ui';
import { catalogHref, catalogQueryFromSearchParams } from './catalog-query';
import styles from './catalog.module.css';
import { CatalogFilters } from './catalog-filters';
import { CatalogResults } from './catalog-results';

/** Public catalog. The address holds the filters, and the server returns the page. */
const CatalogComponent = function() {
  const params = useSearchParams();
  const router = useRouter();
  const query = catalogQueryFromSearchParams(params);
  const { cards, page, pageCount, total, ceiling, isLoading, error } = useCatalog(query);
  const tags = useTags();

  if (isLoading || tags.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить товары';

    return <Page><p className="status">{message}</p></Page>;
  }

  const filtered = query.q !== '' || query.tag !== '' || query.maxPrice !== null;

  function replace(next: CatalogQuery) {
    router.replace(catalogHref(next));
  }

  function filter(patch: Partial<Omit<CatalogQuery, 'page'>>) {
    replace({ ...query, ...patch, page: 1 });
  }

  return (
    <Page>
      <div className={styles.stack}>
        <CatalogFilters
          query={query.q}
          onQuery={(q) => filter({ q })}
          tags={(tags.data ?? []).map((tag) => tag.name)}
          tag={query.tag}
          onTag={(tag) => filter({ tag })}
          sort={query.sort}
          onSort={(sort) => filter({ sort })}
          max={ceiling}
          price={query.maxPrice ?? ceiling}
          onPrice={(maxPrice) => filter({ maxPrice })}
        />

        <CatalogResults
          cards={cards}
          total={total}
          page={page}
          pageCount={pageCount}
          catalogEmpty={total === 0 && !filtered}
          onPage={(next) => replace({ ...query, page: next })}
        />
      </div>
    </Page>
  );
}

CatalogComponent.displayName = 'Catalog';
export const Catalog = memo(CatalogComponent);

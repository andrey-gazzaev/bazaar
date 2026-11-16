'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useProductCards } from '@/hooks';
import { Page } from '@/ui';
import type { ProductCardVm } from '@/view-models';
import styles from './catalog.module.css';
import { CatalogFilters } from './catalog-filters';
import { CatalogResults } from './catalog-results';
import { filterProductCards } from './filter-product-cards';

/** Filtered catalog of listings. */
export function Catalog() {
  const { cards, isLoading, error } = useProductCards();
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [ceiling, setCeiling] = useState<number | null>(null);

  if (isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить товары';
    return <Page><p className="status">{message}</p></Page>;
  }

  const tag = params.get('tag') ?? '';
  const tags = chipTags(cards);
  const max = cards.reduce((highest, card) => Math.max(highest, card.price), 0);

  const visible = filterProductCards(cards, { query, tag, maxPrice: ceiling });

  function chooseTag(next: string) {
    router.replace(next === '' ? '/' : `/?tag=${encodeURIComponent(next)}`);
  }

  return (
    <Page>
      <div className={styles.stack}>
        <CatalogFilters
          query={query}
          onQuery={setQuery}
          tags={tags}
          tag={tag}
          onTag={chooseTag}
          max={max}
          price={ceiling ?? max}
          onPrice={setCeiling}
        />

        <CatalogResults cards={visible} catalogEmpty={cards.length === 0} />
      </div>
    </Page>
  );
}

function chipTags(cards: readonly ProductCardVm[]): readonly string[] {
  const names = new Set(cards.flatMap((card) => card.tags));

  return [...names].sort((left, right) => left.localeCompare(right, 'ru'));
}

'use client';

import { useCatalog } from '@/hooks';
import { Panel } from '@/ui';
import { CatalogPager } from './catalog-pager';
import styles from './catalog-results.module.css';
import { ProductCard } from './product-card';
import { useCatalogAddress } from './use-catalog-address';

/** Heading, count, cards, and the pager. */
export function CatalogResults() {
  const { query, replace } = useCatalogAddress();
  const { cards, page, pageCount, total, isLoading, error } = useCatalog(query);

  if (isLoading) return <p className="muted">Загрузка…</p>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить товары';

    return <p className="status">{message}</p>;
  }

  const filtered = query.q !== '' || query.tag !== '' || query.maxPrice !== null;
  const catalogEmpty = total === 0 && !filtered;

  function onPage(next: number) {
    replace({ ...query, page: next });
  }

  return (
    <Panel className={styles.panel}>
      <div className={styles.head}>
        <h1 className={styles.title}>Каталог</h1>
        <p className={styles.count}>Найдено товаров: {total}</p>
      </div>

      {catalogEmpty ? <p className="muted">Пока нет товаров.</p> : null}

      {!catalogEmpty && cards.length === 0 ? <p className="muted">Ничего не найдено.</p> : null}

      {cards.length > 0 ? (
        <div className={styles.grid}>
          {cards.map((card) => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>
      ) : null}

      <CatalogPager page={page} pageCount={pageCount} onPage={onPage} />
    </Panel>
  );
}

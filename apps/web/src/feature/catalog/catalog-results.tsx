import { memo } from 'react';
import { Panel } from '@/ui';
import type { ProductCardVm } from '@/view-models';
import { CatalogPager } from './catalog-pager';
import styles from './catalog-results.module.css';
import { ProductCard } from './product-card';

/** Heading, count, cards, and the pager. */
const CatalogResultsComponent = function({
  cards,
  total,
  page,
  pageCount,
  catalogEmpty,
  onPage,
}: {
  /** Cards on this page. Empty when none matched. */
  readonly cards: readonly ProductCardVm[];

  /** How many listings match the filter. */
  readonly total: number;

  /** Current page, starting at 1. */
  readonly page: number;

  /** How many pages match. Zero when nothing matches. */
  readonly pageCount: number;

  /** True when the shop has no listings at all. */
  readonly catalogEmpty: boolean;

  /** Stores the next page. */
  readonly onPage: (page: number) => void;
}) {
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

CatalogResultsComponent.displayName = 'CatalogResults';
export const CatalogResults = memo(CatalogResultsComponent);

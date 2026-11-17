import { memo } from 'react';
import { Button } from '@/ui';
import styles from './catalog-pager.module.css';

/** Moves between catalog pages. Hidden when one page covers the result. */
const CatalogPagerComponent = function({
  page,
  pageCount,
  onPage,
}: {
  /** Current page, starting at 1. */
  readonly page: number;

  /** How many pages match. Zero when nothing matches. */
  readonly pageCount: number;

  /** Stores the next page. */
  readonly onPage: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <div className={styles.pager}>
      <Button variant="ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Назад
      </Button>

      <span className={styles.page}>
        {page} / {pageCount}
      </span>

      <Button variant="ghost" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
        Дальше
      </Button>
    </div>
  );
}

CatalogPagerComponent.displayName = 'CatalogPager';
export const CatalogPager = memo(CatalogPagerComponent);

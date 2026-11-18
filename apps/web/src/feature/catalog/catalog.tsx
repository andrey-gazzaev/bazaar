import { Suspense } from 'react';
import { Page } from '@/ui';
import styles from './catalog.module.css';
import { CatalogFilters } from './catalog-filters';
import { CatalogResults } from './catalog-results';

/** Public catalog. The address holds the filters, and the server returns the page. */
export function Catalog() {
  return (
    <Page>
        <div className={styles.stack}>

          <Suspense fallback={<p className="muted">Загрузка…</p>}>
          <CatalogFilters />
            <CatalogResults />
          </Suspense>
      </div>
    </Page>
  );
}

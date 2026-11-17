'use client';

import { memo, Suspense } from 'react';
import { Catalog } from '@/feature';

/** Shop catalog. */
const CatalogPageComponent = function() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <Catalog />
    </Suspense>
  );
}

CatalogPageComponent.displayName = 'CatalogPage';
export const CatalogPage = memo(CatalogPageComponent);

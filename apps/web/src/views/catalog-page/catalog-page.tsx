'use client';

import { Suspense } from 'react';
import { Catalog } from '@/feature';

/** Shop catalog. */
export function CatalogPage() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <Catalog />
    </Suspense>
  );
}

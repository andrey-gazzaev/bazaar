'use client';

import { memo } from 'react';
import { Catalog } from '@/feature';

const catalogPageComponent = function CatalogPageComponent() {
  return <Catalog />;
};
catalogPageComponent.displayName = 'CatalogPage';
/** Shop catalog. */
export const CatalogPage = memo(catalogPageComponent);

import { memo } from 'react';
import { CatalogPage } from '@/views';

/** Catalog route. */
const PageComponent = function() {
  return <CatalogPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

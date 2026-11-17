import { memo } from 'react';
import { ListingsPage } from '@/views';

/** Seller listings route. */
const PageComponent = function() {
  return <ListingsPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

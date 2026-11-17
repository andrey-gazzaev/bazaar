import { memo } from 'react';
import { CartPage } from '@/views';

/** Cart route. */
const PageComponent = function() {
  return <CartPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

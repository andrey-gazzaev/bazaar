import { memo } from 'react';
import { AdminTagsPage } from '@/views';

/** Tag administration route. */
const PageComponent = function() {
  return <AdminTagsPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

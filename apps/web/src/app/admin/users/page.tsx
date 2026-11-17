import { memo } from 'react';
import { AdminUsersPage } from '@/views';

/** Account administration route. */
const PageComponent = function() {
  return <AdminUsersPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

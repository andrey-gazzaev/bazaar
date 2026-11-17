import { memo } from 'react';
import { AdminModerationPage } from '@/views';

/** Moderation route. */
const PageComponent = function() {
  return <AdminModerationPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

import { memo } from 'react';
import { SettingsPage } from '@/views';

/** Settings route. */
const PageComponent = function() {
  return <SettingsPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

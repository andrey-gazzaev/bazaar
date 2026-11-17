import { memo } from 'react';
import { SignUpPage } from '@/views';

/** Registration route. */
const PageComponent = function() {
  return <SignUpPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

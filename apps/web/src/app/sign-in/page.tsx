import { memo } from 'react';
import { SignInPage } from '@/views';

/** Sign-in route. */
const PageComponent = function() {
  return <SignInPage />;
}

PageComponent.displayName = 'Page';
export default memo(PageComponent);

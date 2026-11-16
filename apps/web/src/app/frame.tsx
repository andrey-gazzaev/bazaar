'use client';

import { memo, type ReactNode } from 'react';
import { AccountMenu } from '@/feature';
import { Shell, Topbar } from '@/ui';

const frameComponent = function FrameComponent({ children }: { readonly children: ReactNode }) {
  return (
    <Shell>
      <Topbar brand={<a href="/">Базар</a>}>
        <AccountMenu />
      </Topbar>

      {children}
    </Shell>
  );
};
frameComponent.displayName = 'Frame';
/** Shop chrome: brand, account, and the page. */
export const Frame = memo(frameComponent);

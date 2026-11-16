'use client';

import type { ReactNode } from 'react';
import { AccountMenu } from '@/feature';
import { Shell, Topbar } from '@/ui';

/** Shop chrome: brand, account, and the page. */
export function Frame({ children }: { readonly children: ReactNode }) {
  return (
    <Shell>
      <Topbar brand={<a href="/">Базар</a>}>
        <AccountMenu />
      </Topbar>

      {children}
    </Shell>
  );
}

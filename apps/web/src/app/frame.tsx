'use client';

import type { ReactNode } from 'react';
import { AccountMenu } from '@/feature';
import { Shell, Sidebar } from '@/ui';

/** Shop chrome: sidebar and the page. */
export function Frame({ children }: { readonly children: ReactNode }) {
  return (
    <Shell>
      <Sidebar brand={<a href="/">Базар</a>}>
        <AccountMenu />
      </Sidebar>

      {children}
    </Shell>
  );
}

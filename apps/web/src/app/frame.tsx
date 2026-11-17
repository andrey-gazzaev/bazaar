'use client';

import { usePathname } from 'next/navigation';
import { memo, type ReactNode } from 'react';
import { AccountMenu, ProfileMenu } from '@/feature';
import { Center, Shell, Sidebar } from '@/ui';
import styles from './frame.module.css';

/** Shop chrome. Sign-in and registration are centered, without the sidebar. */
const FrameComponent = function({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const authPage = pathname === '/sign-in' || pathname === '/sign-up';

  if (authPage) return <Center>{children}</Center>;

  return (
    <Shell>
      <Sidebar brand={<a href="/">Базар</a>}>
        <AccountMenu />
      </Sidebar>

      <div className={styles.column}>
        <ProfileMenu />
        {children}
      </div>
    </Shell>
  );
}

FrameComponent.displayName = 'Frame';
export const Frame = memo(FrameComponent);

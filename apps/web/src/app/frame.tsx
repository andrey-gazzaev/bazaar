'use client';

import { usePathname } from 'next/navigation';
import { memo, type ReactNode } from 'react';
import { Center, Shell, Sidebar } from '@/ui';
import styles from './frame.module.css';

/** Shop chrome. Sign-in and registration are centered, without the sidebar. */
const FrameComponent = function({
  menu,
  profile,
  children,
}: {
  /** Role links for the sidebar. */
  readonly menu: ReactNode;

  /** Name and sign-out for the signed-in person. */
  readonly profile: ReactNode;

  /** Page content. */
  readonly children: ReactNode;
}) {
  const pathname = usePathname();
  const authPage = pathname === '/sign-in' || pathname === '/sign-up';

  if (authPage) return <Center>{children}</Center>;

  return (
    <Shell>
      <Sidebar brand={<a href="/">Базар</a>}>
        {menu}
      </Sidebar>

      <div className={styles.column}>
        {profile}
        {children}
      </div>
    </Shell>
  );
};

FrameComponent.displayName = 'Frame';
export const Frame = memo(FrameComponent);

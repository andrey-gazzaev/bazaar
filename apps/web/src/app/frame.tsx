import type { ReactNode } from 'react';
import { Shell, Sidebar } from '@/ui';
import styles from './frame.module.css';

/** Shop chrome: the sidebar and the page column. */
export function Frame({
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
}

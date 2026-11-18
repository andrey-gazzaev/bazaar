import type { ReactNode } from 'react';
import { Icon, Shell, Sidebar } from '@/ui';
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
      <Sidebar
        brand={(
          <a href="/" className={styles.logo}>
            <span className={styles.mark}>
              <Icon name="shop" />
            </span>
            <span className={styles.word}>Базар</span>
          </a>
        )}
      >
        {menu}
      </Sidebar>

      <div className={styles.column}>
        {profile}
        {children}
      </div>
    </Shell>
  );
}

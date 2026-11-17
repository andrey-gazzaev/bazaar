import { memo, type ReactNode } from 'react';
import styles from './sidebar.module.css';

/** Vertical card. The brand slot is accent-colored, and the caller supplies what sits under it. */
const SidebarComponent = function({
  brand,
  children,
}: {
  /** Brand shown at the top of the card. */
  readonly brand: ReactNode;

  /** Content stacked under the brand. */
  readonly children: ReactNode;
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>{brand}</div>

      <div className={styles.body}>{children}</div>
    </aside>
  );
}

SidebarComponent.displayName = 'Sidebar';
export const Sidebar = memo(SidebarComponent);

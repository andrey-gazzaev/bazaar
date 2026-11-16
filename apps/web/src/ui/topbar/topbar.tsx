import type { ReactNode } from 'react';
import styles from './topbar.module.css';

/** Sticky bar with the brand and page actions. */
export function Topbar({
  brand,
  children,
}: {
  readonly brand: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.actions}>{children}</div>
    </header>
  );
}

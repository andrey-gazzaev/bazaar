import type { ReactNode } from 'react';
import styles from './center.module.css';

/** Places its child in the middle of the screen. */
export function Center({ children }: { readonly children: ReactNode }) {
  return <div className={styles.center}>{children}</div>;
}

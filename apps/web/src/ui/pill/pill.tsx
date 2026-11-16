import type { ReactNode } from 'react';
import styles from './pill.module.css';

/** Small label chip with no knowledge of what it names. */
export function Pill({ children }: { readonly children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
}

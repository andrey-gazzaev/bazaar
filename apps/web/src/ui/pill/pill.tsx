import { memo, type ReactNode } from 'react';
import styles from './pill.module.css';

/** Small label chip with no knowledge of what it names. */
const PillComponent = function({ children }: { readonly children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
}

PillComponent.displayName = 'Pill';
export const Pill = memo(PillComponent);

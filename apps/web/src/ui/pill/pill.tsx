import { memo, type ReactNode } from 'react';
import styles from './pill.module.css';

const pillComponent = function PillComponent({ children }: { readonly children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
};
pillComponent.displayName = 'Pill';
/** Small label chip with no knowledge of what it names. */
export const Pill = memo(pillComponent);

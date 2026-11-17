import { memo, type ReactNode } from 'react';
import styles from './center.module.css';

/** Places its child in the middle of the screen. */
const CenterComponent = function({ children }: { readonly children: ReactNode }) {
  return <div className={styles.center}>{children}</div>;
}

CenterComponent.displayName = 'Center';
export const Center = memo(CenterComponent);

import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './nav-item.module.css';

/** Link in a vertical nav. Selected is a solid accent pill. */
export function NavItem({
  href,
  selected = false,
  icon,
  children,
}: {
  /** Address this item opens. */
  readonly href: string;

  /** True when this item is the current destination. */
  readonly selected?: boolean;

  /** Mark shown before the label. Empty when the item is text only. */
  readonly icon?: ReactNode;

  /** Label of the destination. */
  readonly children: ReactNode;
}) {
  return (
    <a href={href} className={clsx(styles.item, selected && styles.selected)}>
      {icon}
      {children}
    </a>
  );
}

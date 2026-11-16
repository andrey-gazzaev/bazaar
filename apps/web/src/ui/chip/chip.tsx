import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './chip.module.css';

/** Choice button. Selected is filled; otherwise it is white with a border. */
export function Chip({
  selected = false,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & {
  /** True when this chip is the active choice. */
  readonly selected?: boolean;
}) {
  return <button type={type} className={clsx(styles.chip, selected && styles.selected, className)} {...props} />;
}

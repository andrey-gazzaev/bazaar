import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './shell.module.css';

/** Two-column chrome for the sidebar and the page. */
export function Shell({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx(styles.shell, className)} {...props} />;
}

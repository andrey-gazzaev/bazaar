import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './page.module.css';

/** Main column for one page. */
export function Page({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx(styles.page, className)} {...props} />;
}

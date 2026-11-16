import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './panel.module.css';

/** Bordered section of a page. */
export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return <section className={clsx(styles.panel, className)} {...props} />;
}

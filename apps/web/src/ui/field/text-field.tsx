import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './field.module.css';

/** Single-line text input. */
export function TextField({ className, ...props }: ComponentProps<'input'>) {
  return <input className={clsx(styles.control, className)} {...props} />;
}

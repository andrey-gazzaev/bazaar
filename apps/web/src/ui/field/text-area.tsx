import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './field.module.css';

/** Multi-line text input. */
export function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={clsx(styles.control, styles.area, className)} {...props} />;
}

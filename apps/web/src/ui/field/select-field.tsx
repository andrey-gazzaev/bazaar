import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './field.module.css';

/** Single-choice dropdown. */
export function SelectField({ className, ...props }: ComponentProps<'select'>) {
  return <select className={clsx(styles.control, className)} {...props} />;
}

import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './field.module.css';

/** Multi-line text input. The caption is optional. */
export function TextArea({
  className,
  label,
  ...props
}: ComponentProps<'textarea'> & {
  /** Caption above the input. Empty when the caller labels it another way. */
  readonly label?: string;
}) {
  const control = <textarea className={clsx(styles.control, styles.area, className)} {...props} />;

  if (!label) {
    return control;
  }

  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>

      {control}
    </label>
  );
}

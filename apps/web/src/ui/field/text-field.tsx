import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import styles from './field.module.css';

/** Single-line text input. The caption and inner adornment are optional. */
export function TextField({
  className,
  label,
  adornment,
  ...props
}: ComponentProps<'input'> & {
  /** Caption above the input. Empty when the caller labels it another way. */
  readonly label?: string;

  /** Content drawn inside the input. Empty when the field is plain. */
  readonly adornment?: ReactNode;
}) {
  const control = (
    <input className={clsx(styles.control, adornment && styles.withAdornment, className)} {...props} />
  );

  if (!label && !adornment) {
    return control;
  }

  const entry = adornment ? (
    <span className={styles.adorned}>
      <span className={styles.adornment}>{adornment}</span>
      {control}
    </span>
  ) : (
    control
  );

  if (!label) {
    return entry;
  }

  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>

      {entry}
    </label>
  );
}

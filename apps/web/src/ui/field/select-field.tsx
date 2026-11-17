import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './field.module.css';

/** Single-choice dropdown. The caption is optional. */
const SelectFieldComponent = function({
  className,
  label,
  ...props
}: ComponentProps<'select'> & {
  /** Caption above the dropdown. Empty when the caller labels it another way. */
  readonly label?: string;
}) {
  const control = <select className={clsx(styles.control, className)} {...props} />;

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

SelectFieldComponent.displayName = 'SelectField';
export const SelectField = memo(SelectFieldComponent);

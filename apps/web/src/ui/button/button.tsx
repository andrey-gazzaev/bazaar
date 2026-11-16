import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './button.module.css';

/** Action control. Primary is filled, ghost is quiet, danger is a destructive action. */
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { readonly variant?: 'primary' | 'ghost' | 'danger' }) {
  const tone = variant === 'ghost' ? styles.ghost : variant === 'danger' ? styles.danger : styles.primary;

  return <button type={type} className={clsx(tone, className)} {...props} />;
}

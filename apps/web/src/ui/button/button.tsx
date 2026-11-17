import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './button.module.css';

type ButtonProps = {
  /** Filled, quiet, or destructive. Empty means filled. */
  readonly variant?: 'primary' | 'ghost' | 'danger';
} & (
  | (Omit<ComponentProps<'a'>, 'href'> & {
      /** Address to open. Present when this control is a link. */
      readonly href: string;
    })
  | (ComponentProps<'button'> & {
      /** Address to open. Empty when this control stays a button. */
      readonly href?: undefined;
    })
);

/** Action control. Primary is filled, ghost is quiet, danger is destructive. It is a link when href is set. */
const ButtonComponent = function({ variant = 'primary', className, ...props }: ButtonProps) {
  const tone = variant === 'ghost' ? styles.ghost : variant === 'danger' ? styles.danger : styles.primary;

  if (props.href !== undefined) {
    return <a className={clsx(tone, className)} {...props} />;
  }

  const { type = 'button', ...buttonProps } = props;

  return <button type={type} className={clsx(tone, className)} {...buttonProps} />;
}

ButtonComponent.displayName = 'Button';
export const Button = memo(ButtonComponent);

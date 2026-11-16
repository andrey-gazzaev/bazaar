import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './field.module.css';

const textFieldComponent = function TextFieldComponent({ className, ...props }: ComponentProps<'input'>) {
  return <input className={clsx(styles.control, className)} {...props} />;
};
textFieldComponent.displayName = 'TextField';
/** Single-line text input. */
export const TextField = memo(textFieldComponent);

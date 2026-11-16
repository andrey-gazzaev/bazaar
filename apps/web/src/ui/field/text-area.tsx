import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './field.module.css';

const textAreaComponent = function TextAreaComponent({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={clsx(styles.control, styles.area, className)} {...props} />;
};
textAreaComponent.displayName = 'TextArea';
/** Multi-line text input. */
export const TextArea = memo(textAreaComponent);

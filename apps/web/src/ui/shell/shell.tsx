import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './shell.module.css';

/** Two-column chrome for the sidebar and the page. */
const ShellComponent = function({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx(styles.shell, className)} {...props} />;
}

ShellComponent.displayName = 'Shell';
export const Shell = memo(ShellComponent);

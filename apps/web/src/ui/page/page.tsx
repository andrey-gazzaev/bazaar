import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './page.module.css';

/** Main column for one page. */
const PageComponent = function({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx(styles.page, className)} {...props} />;
}

PageComponent.displayName = 'Page';
export const Page = memo(PageComponent);

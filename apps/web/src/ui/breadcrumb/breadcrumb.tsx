import { Fragment } from 'react';
import styles from './breadcrumb.module.css';

/** One step in a breadcrumb trail. */
export type Crumb = {
  /** Address of this step. Omit on the current page. */
  readonly href?: string;

  /** Visible name of this step. */
  readonly label: string;
};

/** Trail of page names. The last step is the current page when it has no address. */
export function Breadcrumb({
  items,
}: {
  /** Steps from the root to the current page. Empty when there is nowhere to show. */
  readonly items: readonly Crumb[];
}) {
  return (
    <nav className={styles.breadcrumb}>
      {items.map((item, index) => {
        const current = index === items.length - 1 && item.href === undefined;
        const crumb =
          item.href === undefined ? (
            <span aria-current={current ? 'page' : undefined}>{item.label}</span>
          ) : (
            <a href={item.href}>{item.label}</a>
          );

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? ' / ' : null}
            {crumb}
          </Fragment>
        );
      })}
    </nav>
  );
}

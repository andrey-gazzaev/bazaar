import clsx from 'clsx';
import { memo, type ComponentProps } from 'react';
import styles from './panel.module.css';

/** Bordered section of a page. */
const PanelComponent = function({ className, ...props }: ComponentProps<'section'>) {
  return <section className={clsx(styles.panel, className)} {...props} />;
}

PanelComponent.displayName = 'Panel';
export const Panel = memo(PanelComponent);

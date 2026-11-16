import type { ComponentProps } from 'react';
import styles from './media.module.css';

/** Image that fills its frame. */
export function Media({ alt, ...props }: ComponentProps<'img'>) {
  return <img className={styles.media} alt={alt} {...props} />;
}

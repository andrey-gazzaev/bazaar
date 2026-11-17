import { memo, type ComponentProps } from 'react';
import styles from './media.module.css';

/** Image that fills its frame. */
const MediaComponent = function({ alt, ...props }: ComponentProps<'img'>) {
  return <img className={styles.media} alt={alt} {...props} />;
}

MediaComponent.displayName = 'Media';
export const Media = memo(MediaComponent);

import { memo, type ComponentProps } from 'react';
import styles from './media.module.css';

const mediaComponent = function MediaComponent({ alt, ...props }: ComponentProps<'img'>) {
  return <img className={styles.media} alt={alt} {...props} />;
};
mediaComponent.displayName = 'Media';
/** Image that fills its frame. */
export const Media = memo(mediaComponent);

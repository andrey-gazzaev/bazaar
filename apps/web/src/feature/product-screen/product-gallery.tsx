'use client';

import { memo, useState } from 'react';
import { Media } from '@/ui';
import styles from './product-gallery.module.css';

/** Pictures for one listing. The frame stays empty when there are no pictures. */
const ProductGalleryComponent = function({
  name,
  images,
}: {
  /** Listing title, used as the picture label. */
  readonly name: string;

  /** Picture paths. Empty when the listing has no pictures. */
  readonly images: readonly string[];
}) {
  const [selected, setSelected] = useState(0);

  const current = images[selected];

  return (
    <div className={styles.gallery}>
      <div className={styles.frame}>
        <div className={styles.picture}>{current ? <Media src={current} alt={name} /> : null}</div>
      </div>

      {images.length > 0 ? (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={styles.thumb}
              aria-pressed={index === selected}
              aria-label={`${name}, фото ${index + 1}`}
              onClick={() => setSelected(index)}
            >
              <Media src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

ProductGalleryComponent.displayName = 'ProductGallery';
export const ProductGallery = memo(ProductGalleryComponent);

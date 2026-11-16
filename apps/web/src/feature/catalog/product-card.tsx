import { memo } from 'react';
import type { ProductCardVm } from '@/view-models';
import { Media, Pill } from '@/ui';
import styles from './catalog.module.css';

const productCardComponent = function ProductCardComponent({ card }: { readonly card: ProductCardVm }) {
  return (
    <a className={styles.card} href={`/products/${card.id}`}>
      <div className={styles.cover}>{card.image ? <Media src={card.image} alt="" /> : null}</div>

      <div className={styles.body}>
        <h2 className={styles.title}>{card.name}</h2>
        <p className={styles.price}>{card.priceLabel}</p>

        {card.tags.length > 0 ? (
          <div className={styles.tags}>
            {card.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
        ) : null}

        <p className={styles.seller}>{card.sellerName}</p>
      </div>
    </a>
  );
};
productCardComponent.displayName = 'ProductCard';
/** One listing in the catalog. */
export const ProductCard = memo(productCardComponent);

import { Icon, Media } from '@/ui';
import type { ProductCardVm } from '@/view-models';
import styles from './catalog.module.css';

/** One listing in the catalog. */
export function ProductCard({ card }: { readonly card: ProductCardVm }) {
  return (
    <a className={styles.card} href={`/products/${card.id}`}>
      <div className={styles.cover}>{card.image ? <Media src={card.image} alt="" /> : null}</div>

      <div className={styles.body}>
        <h2 className={styles.title}>{card.name}</h2>
        <p className={styles.price}>{card.priceLabel}</p>
        <p className={styles.stock}>{card.stockLabel}</p>

        <p className={styles.seller}>
          <span className={styles.shop}>
            <Icon name="shop" />
          </span>
          {card.sellerName}
        </p>
      </div>
    </a>
  );
}

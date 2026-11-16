import { Panel } from '@/ui';
import type { ProductCardVm } from '@/view-models';
import styles from './catalog-results.module.css';
import { ProductCard } from './product-card';

/** Heading, count, and the cards that matched. */
export function CatalogResults({
  cards,
  catalogEmpty,
}: {
  /** Cards that passed the filter. Empty when none matched. */
  readonly cards: readonly ProductCardVm[];

  /** True when the shop has no listings at all. */
  readonly catalogEmpty: boolean;
}) {
  return (
    <Panel className={styles.panel}>
      <div className={styles.head}>
        <h1 className={styles.title}>Каталог</h1>
        <p className={styles.count}>Найдено товаров: {cards.length}</p>
      </div>

      {catalogEmpty ? <p className="muted">Пока нет товаров.</p> : null}

      {!catalogEmpty && cards.length === 0 ? <p className="muted">Ничего не найдено.</p> : null}

      {cards.length > 0 ? (
        <div className={styles.grid}>
          {cards.map((card) => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>
      ) : null}
    </Panel>
  );
}

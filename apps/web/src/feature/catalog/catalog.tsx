'use client';

import { useProductCards } from '@/hooks';
import { Page } from '@/ui';
import styles from './catalog.module.css';
import { ProductCard } from './product-card';

/** Grid of listings. */
export function Catalog() {
  const { cards, isLoading, error } = useProductCards();

  if (isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить товары';
    return <Page><p className="status">{message}</p></Page>;
  }

  return (
    <Page>
      <h1>Товары</h1>

      {cards.length === 0 ? <p className="muted">Пока нет товаров.</p> : null}

      <div className={styles.grid}>
        {cards.map((card) => (
          <ProductCard key={card.id} card={card} />
        ))}
      </div>
    </Page>
  );
}

'use client';

import { useMemo } from 'react';
import { buildProductCard } from '@/hooks';
import { useProducts } from '@/queries';
import { Page } from '@/ui';
import styles from './catalog.module.css';
import { ProductCard } from './product-card';

/** Grid of listings. */
export function Catalog() {
  const products = useProducts();
  const cards = useMemo(() => (products.data ?? []).map(buildProductCard), [products.data]);

  if (products.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (products.error) {
    const message = products.error instanceof Error ? products.error.message : 'Не удалось загрузить товары';
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

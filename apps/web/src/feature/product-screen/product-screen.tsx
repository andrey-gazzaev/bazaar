'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSessionContext } from '@/context';
import { useCart } from '@/hooks';
import { formatPrice, formatStock } from '@/services';
import { useDeleteProduct, useProduct } from '@/queries';
import { Breadcrumb, Button, Icon, Page, Panel, Pill, type Crumb } from '@/ui';
import styles from './product-screen.module.css';
import { ProductGallery } from './product-gallery';

/** One listing: its pictures, price, and the current person's actions. */
export function ProductScreen({
  productId,
}: {
  /** Listing to show. */
  readonly productId: string;
}) {
  const product = useProduct(productId);
  const session = useSessionContext();
  const remove = useDeleteProduct();
  const shop = useCart();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (product.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (product.error || !product.data) {
    const message = product.error instanceof Error ? product.error.message : 'Товар не найден';
    return <Page><p className="status">{message}</p></Page>;
  }

  const listing = product.data;
  const category = listing.tags[0];
  const owns = session.user?.id === listing.sellerId;
  const shopper = session.user?.role === 'CLIENT' || session.user?.role === 'SELLER';
  const canBuy = listing.status === 'APPROVED' && shopper && listing.stock > 0;

  const crumbs: readonly Crumb[] = [
    { href: '/', label: 'Главная' },
    { href: '/', label: 'Каталог' },
    ...(category ? [{ href: `/?tag=${encodeURIComponent(category.name)}`, label: category.name }] : []),
    { label: listing.name },
  ];

  async function add() {
    if (!shop.cart) return;

    const line = shop.cart.lines.find((item) => item.productId === listing.id);

    if (line) return;

    setError(null);

    try {
      await shop.setCartItem({ productId: listing.id, quantity: 1 });
      setAdded(true);
    } catch (caught) {
      setAdded(false);
      setError(caught instanceof Error ? caught.message : 'Не удалось добавить в корзину');
    }
  }

  async function onDelete() {
    setError(null);

    try {
      await remove.mutateAsync(listing.id);
      router.push('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось удалить товар');
    }
  }

  return (
    <Page>
      <div className={styles.stack}>
        <Breadcrumb items={crumbs} />

        <div className={styles.layout}>
          <ProductGallery name={listing.name} images={listing.images} />

          <Panel>
            <div className={styles.copy}>
              <div className={styles.heading}>
                {category ? <p className={styles.kicker}>{category.name}</p> : null}
                <h1 className={styles.title}>{listing.name}</h1>
              </div>

              <p className={styles.price}>{formatPrice(listing.price)}</p>
              <p className="muted">{formatStock(listing.stock)}</p>

              <p className={styles.seller}>
                <span className={styles.shop}>
                  <Icon name="shop" />
                </span>
                {listing.sellerName}
              </p>

              <p className={styles.description}>{listing.description}</p>

              {listing.tags.length > 0 ? (
                <div className={styles.tags}>
                  {listing.tags.map((tag) => (
                    <Pill key={tag.id}>{tag.name}</Pill>
                  ))}
                </div>
              ) : null}

              <div className={styles.actions}>
                {canBuy ? (
                  <Button
                    className={styles.buy}
                    onClick={() => void add()}
                    disabled={shop.isSaving || shop.isLoading || !shop.cart}
                  >
                    {shop.isSaving ? 'Добавляем…' : 'В корзину'}
                  </Button>
                ) : null}

                {added ? <a href="/cart">Перейти в корзину</a> : null}

                {!session.user && listing.stock > 0 ? <a href="/sign-in">Войдите, чтобы купить</a> : null}

                {owns && !confirming ? (
                  <Button variant="danger" onClick={() => setConfirming(true)}>
                    Удалить
                  </Button>
                ) : null}

                {owns && confirming ? (
                  <Button variant="danger" onClick={() => void onDelete()} disabled={remove.isPending}>
                    {remove.isPending ? 'Удаляем…' : 'Подтвердить удаление'}
                  </Button>
                ) : null}
              </div>

              {error ? <p className="status">{error}</p> : null}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

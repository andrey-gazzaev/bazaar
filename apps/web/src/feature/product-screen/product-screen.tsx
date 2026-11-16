'use client';

import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useSessionContext } from '@/context';
import { formatPrice } from '@/services';
import { useDeleteProduct, useProduct } from '@/queries';
import { Button, Media, Page, Panel, Pill } from '@/ui';
import styles from './product-screen.module.css';

const productScreenComponent = function ProductScreenComponent({ productId }: { readonly productId: string }) {
  const product = useProduct(productId);
  const session = useSessionContext();
  const remove = useDeleteProduct();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (product.isLoading || session.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (product.error || !product.data) {
    const message = product.error instanceof Error ? product.error.message : 'Товар не найден';
    return <Page><p className="status">{message}</p></Page>;
  }

  const listing = product.data;
  const owns = session.user?.id === listing.sellerId;
  const canBuy = session.user && session.user.role !== 'ADMIN';

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
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.frame}>
            {listing.images[0] ? <Media src={listing.images[0]} alt={listing.name} /> : null}
          </div>

          {listing.images.length > 1 ? (
            <div className={styles.thumbs}>
              {listing.images.slice(1).map((image) => (
                <div className={styles.thumb} key={image}>
                  <Media src={image} alt="" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Panel>
          <div className={styles.copy}>
            <h1 className={styles.title}>{listing.name}</h1>
            <p className={styles.price}>{formatPrice(listing.price)}</p>
            <p className="muted">{listing.sellerName}</p>
            <p>{listing.description}</p>

            {listing.tags.length > 0 ? (
              <div className={styles.tags}>
                {listing.tags.map((tag) => (
                  <Pill key={tag.id}>{tag.name}</Pill>
                ))}
              </div>
            ) : null}

            <div className={styles.actions}>
              {canBuy ? <a href={`/products/${listing.id}/checkout`}>Купить</a> : null}
              {!session.user ? <a href="/sign-in">Войдите, чтобы купить</a> : null}

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
    </Page>
  );
};
productScreenComponent.displayName = 'ProductScreen';
/** Listing, its price, and the actions of the current person. */
export const ProductScreen = memo(productScreenComponent);

'use client';

import { useState } from 'react';
import { useSessionContext } from '@/context';
import { useCheckout } from '@/hooks';
import type { Order, Shipping } from '@/models';
import { useCreateOrder } from '@/queries';
import { formatPrice } from '@/services';
import { Page, Panel } from '@/ui';
import { CheckoutForm } from './checkout-form';
import styles from './checkout-form.module.css';

/** Delivery details and a mock purchase of one listing. */
export function Checkout({ productId }: { readonly productId: string }) {
  const session = useSessionContext();
  const { checkout, isLoading, error } = useCheckout(productId);
  const createOrder = useCreateOrder();
  const [order, setOrder] = useState<Order | null>(null);

  if (session.isLoading || isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (!session.user) {
    return (
      <Page>
        <Panel>
          <h1>Покупка</h1>
          <p className="muted">
            <a href="/sign-in">Войдите</a>, чтобы оформить заказ.
          </p>
        </Panel>
      </Page>
    );
  }

  if (session.user.role === 'ADMIN') {
    return (
      <Page>
        <Panel>
          <h1>Покупка</h1>
          <p className="muted">Покупка доступна клиентам и продавцам.</p>
        </Panel>
      </Page>
    );
  }

  if (error || !checkout) {
    const message = error instanceof Error ? error.message : 'Товар не найден';
    return <Page><p className="status">{message}</p></Page>;
  }

  async function onSubmit(shipping: Shipping) {
    const next = await createOrder.mutateAsync({ productId, shipping });
    setOrder(next);
  }

  return (
    <Page className={styles.stack}>
      <h1 className={styles.title}>Оформление</h1>

      {order ? (
        <Panel>
          <p>Заказ {order.id} оформлен.</p>
          <p className="muted">Сумма {formatPrice(order.price)}. Оплата в этой версии не списывает деньги.</p>
        </Panel>
      ) : (
        <CheckoutForm checkout={checkout} pending={createOrder.isPending} onSubmit={onSubmit} />
      )}
    </Page>
  );
}

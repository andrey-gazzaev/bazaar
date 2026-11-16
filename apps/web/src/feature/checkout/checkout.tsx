'use client';

import { useState } from 'react';
import { useSessionContext } from '@/context';
import { buildCheckout } from '@/hooks';
import type { Order, Shipping } from '@/models';
import { useCreateOrder, useProduct } from '@/queries';
import { formatPrice } from '@/services';
import { Page, Panel } from '@/ui';
import { CheckoutForm } from './checkout-form';

/** Delivery details and a mock purchase of one listing. */
export function Checkout({ productId }: { readonly productId: string }) {
  const session = useSessionContext();
  const product = useProduct(productId);
  const createOrder = useCreateOrder();
  const [order, setOrder] = useState<Order | null>(null);

  if (session.isLoading || product.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

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

  if (product.error || !product.data) {
    const message = product.error instanceof Error ? product.error.message : 'Товар не найден';
    return <Page><p className="status">{message}</p></Page>;
  }

  async function onSubmit(shipping: Shipping) {
    const next = await createOrder.mutateAsync({ productId, shipping });
    setOrder(next);
  }

  return (
    <Page>
      <Panel>
        <h1>Куда отправить</h1>

        {order ? (
          <div>
            <p>Заказ {order.id} оформлен.</p>
            <p className="muted">Сумма {formatPrice(order.price)}. Оплата в этой версии не списывает деньги.</p>
          </div>
        ) : (
          <CheckoutForm checkout={buildCheckout(product.data)} pending={createOrder.isPending} onSubmit={onSubmit} />
        )}
      </Panel>
    </Page>
  );
}

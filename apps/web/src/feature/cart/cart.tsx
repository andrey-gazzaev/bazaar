'use client';

import { memo, useState } from 'react';
import { useCart } from '@/hooks';
import type { Order, SessionUser } from '@/models';
import { formatPrice } from '@/services';
import { Page, Panel } from '@/ui';
import { CheckoutForm } from './checkout-form';
import styles from './cart.module.css';

/** Cart quantities and one checkout for every line. */
const CartComponent = function({
  user,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;
}) {
  const [orders, setOrders] = useState<readonly Order[] | null>(null);
  const [lineError, setLineError] = useState<string | null>(null);

  const canShop = user?.role === 'CLIENT' || user?.role === 'SELLER';
  const { cart, isLoading, error, isCheckingOut, setCartItem, removeCartItem, checkout } = useCart(canShop);

  if (!user) {
    return (
      <Page>
        <Panel>
          <h1>Корзина</h1>
          <p className="muted">
            <a href="/sign-in">Войдите</a>, чтобы открыть корзину.
          </p>
        </Panel>
      </Page>
    );
  }

  if (user.role === 'ADMIN') {
    return (
      <Page>
        <Panel>
          <h1>Корзина</h1>
          <p className="muted">Покупка доступна клиентам и продавцам.</p>
        </Panel>
      </Page>
    );
  }

  if (isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error || !cart) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить корзину';

    return <Page><p className="status">{message}</p></Page>;
  }

  const total = orders?.reduce((sum, order) => sum + order.price, 0) ?? 0;

  async function changeLine(productId: string, quantity: number) {
    setLineError(null);

    try {
      await setCartItem({ productId, quantity });
    } catch (caught) {
      setLineError(caught instanceof Error ? caught.message : 'Не удалось изменить количество');
    }
  }

  async function dropLine(productId: string) {
    setLineError(null);

    try {
      await removeCartItem(productId);
    } catch (caught) {
      setLineError(caught instanceof Error ? caught.message : 'Не удалось убрать товар');
    }
  }

  return (
    <Page>
      <div className={styles.stack}>
        <h1 className={styles.title}>Корзина</h1>

        {orders ? (
          <Panel>
            {orders.map((order) => (
              <p key={order.id}>Заказ {order.id} оформлен.</p>
            ))}
            <p className="muted">Сумма {formatPrice(total)}. Оплата в этой версии не списывает деньги.</p>
          </Panel>
        ) : null}

        {!orders && cart.empty ? <p className="muted">Корзина пуста</p> : null}

        {lineError ? <p className="status">{lineError}</p> : null}

        {!orders && !cart.empty ? (
          <CheckoutForm
            cart={cart}
            pending={isCheckingOut}
            onSubmit={async (shipping) => {
              setOrders(await checkout(shipping));
            }}
            onQuantity={(productId, quantity) => void changeLine(productId, quantity)}
            onRemove={(productId) => void dropLine(productId)}
          />
        ) : null}
      </div>
    </Page>
  );
}

CartComponent.displayName = 'Cart';
export const Cart = memo(CartComponent);

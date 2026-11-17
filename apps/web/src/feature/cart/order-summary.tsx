import { memo } from 'react';
import type { CartVm } from '@/view-models';
import { Button, Media, Panel } from '@/ui';
import styles from './order-summary.module.css';

/** Every cart line, the free delivery, and the control that places the order. */
const OrderSummaryComponent = function({
  cart,
  pending,
  onQuantity,
  onRemove,
}: {
  /** Lines and totals to confirm. */
  readonly cart: CartVm;

  /** True while checkout is in flight. */
  readonly pending: boolean;

  /** Stores the next quantity of one line. */
  readonly onQuantity: (productId: string, quantity: number) => void;

  /** Drops one line. */
  readonly onRemove: (productId: string) => void;
}) {
  return (
    <Panel className={styles.summary}>
      <h2 className={styles.heading}>Ваш заказ</h2>

      <div className={styles.lines}>
        {cart.lines.map((line) => (
          <div key={line.productId} className={styles.product}>
            <div className={styles.frame}>{line.image ? <Media src={line.image} alt="" /> : null}</div>

            <div>
              <p className={styles.name}>{line.name}</p>
              <p className={`muted ${styles.seller}`}>{line.lineLabel}</p>
              {line.note ? <p className="status">{line.note}</p> : null}

              <div className={styles.quantity}>
                {line.stock > 0 ? (
                  <Button
                    variant="ghost"
                    aria-label={`Меньше ${line.name}`}
                    disabled={line.quantity <= line.stock && line.quantity <= 1}
                    onClick={() =>
                      onQuantity(line.productId, line.quantity > line.stock ? line.stock : line.quantity - 1)
                    }
                  >
                    −
                  </Button>
                ) : null}

                <span>{line.quantity}</span>

                {line.stock > 0 ? (
                  <Button
                    variant="ghost"
                    aria-label={`Больше ${line.name}`}
                    disabled={!line.available || line.quantity >= line.stock}
                    onClick={() => onQuantity(line.productId, line.quantity + 1)}
                  >
                    +
                  </Button>
                ) : null}

                <Button variant="ghost" onClick={() => onRemove(line.productId)}>
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>Доставка</dt>
          <dd>{cart.deliveryLabel}</dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>Итого</dt>
          <dd>{cart.totalLabel}</dd>
        </div>
      </dl>

      <Button className={styles.submit} type="submit" disabled={pending || !cart.ready}>
        {pending ? 'Оформляем…' : 'Подтвердить заказ'}
      </Button>
    </Panel>
  );
}

OrderSummaryComponent.displayName = 'OrderSummary';
export const OrderSummary = memo(OrderSummaryComponent);

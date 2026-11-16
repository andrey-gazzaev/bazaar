import type { CheckoutVm } from '@/view-models';
import { Button, Media, Panel } from '@/ui';
import styles from './order-summary.module.css';

/** Listing photo, seller, and totals, with the control that places the order. */
export function OrderSummary({
  checkout,
  pending,
}: {
  readonly checkout: CheckoutVm;
  readonly pending: boolean;
}) {
  return (
    <Panel className={styles.summary}>
      <h2 className={styles.heading}>Ваш заказ</h2>

      <div className={styles.product}>
        <div className={styles.frame}>{checkout.image ? <Media src={checkout.image} alt="" /> : null}</div>
        <div>
          <p className={styles.name}>{checkout.productName}</p>
          <p className={`muted ${styles.seller}`}>{checkout.sellerName}</p>
        </div>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>Товар</dt>
          <dd>{checkout.totalLabel}</dd>
        </div>
        <div className={styles.row}>
          <dt>Доставка</dt>
          <dd>{checkout.deliveryLabel}</dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>Итого</dt>
          <dd>{checkout.totalLabel}</dd>
        </div>
      </dl>

      <Button className={styles.submit} type="submit" disabled={pending}>
        {pending ? 'Оформляем…' : 'Подтвердить заказ'}
      </Button>
    </Panel>
  );
}

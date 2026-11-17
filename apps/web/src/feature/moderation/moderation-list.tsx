import { memo } from 'react';
import { Button } from '@/ui';
import type { ModerationItemVm } from '@/view-models';
import styles from './moderation-list.module.css';

/** Pending cards and the two review actions. */
const ModerationListComponent = function({
  items,
  pendingId,
  onApprove,
  onReject,
}: {
  /** Cards waiting for review. Empty when the queue is clear. */
  readonly items: readonly ModerationItemVm[];

  /** Listing whose review is in flight. Empty when none is. */
  readonly pendingId: string | null;

  /** Makes one card public. */
  readonly onApprove: (id: string) => void;

  /** Keeps one card hidden. */
  readonly onReject: (id: string) => void;
}) {
  if (items.length === 0) return <p className="muted">Нет товаров на модерации.</p>;

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.row}>
          <a className={styles.name} href={`/products/${item.id}`}>
            {item.name}
          </a>

          <span>{item.sellerName}</span>
          <span>{item.priceLabel}</span>

          <span className={styles.actions}>
            <Button disabled={pendingId === item.id} onClick={() => onApprove(item.id)}>
              Одобрить
            </Button>
            <Button variant="ghost" disabled={pendingId === item.id} onClick={() => onReject(item.id)}>
              Отклонить
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
}

ModerationListComponent.displayName = 'ModerationList';
export const ModerationList = memo(ModerationListComponent);

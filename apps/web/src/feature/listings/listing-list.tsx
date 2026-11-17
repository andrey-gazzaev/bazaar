import { memo } from 'react';
import { Button } from '@/ui';
import type { ListingVm } from '@/view-models';
import styles from './listing-list.module.css';

/** The seller's cards, each with its review state. */
const ListingListComponent = function({
  listings,
  onEdit,
  onDelete,
}: {
  /** Cards the seller owns. Empty when they have none. */
  readonly listings: readonly ListingVm[];

  /** Opens the editor for one card. */
  readonly onEdit: (listing: ListingVm) => void;

  /** Removes one card. */
  readonly onDelete: (id: string) => void;
}) {
  if (listings.length === 0) return <p className="muted">Пока нет объявлений.</p>;

  return (
    <ul className={styles.list}>
      {listings.map((listing) => (
        <li key={listing.id} className={styles.row}>
          <a className={styles.name} href={`/products/${listing.id}`}>
            {listing.name}
          </a>

          <span>{listing.priceLabel}</span>
          <span>{listing.stockLabel}</span>
          <span>{listing.statusLabel}</span>

          <span className={styles.actions}>
            <Button variant="ghost" onClick={() => onEdit(listing)}>
              Изменить
            </Button>
            <Button variant="danger" onClick={() => onDelete(listing.id)}>
              Удалить
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
}

ListingListComponent.displayName = 'ListingList';
export const ListingList = memo(ListingListComponent);

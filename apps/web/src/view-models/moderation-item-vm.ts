/** One pending listing in the admin queue. */
export type ModerationItemVm = {
  /** Listing id. */
  readonly id: string;

  /** Title. */
  readonly name: string;

  /** Seller name. */
  readonly sellerName: string;

  /** Price label in rubles. */
  readonly priceLabel: string;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;
};

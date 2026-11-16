/** One listing on the seller's own page. */
export type ListingVm = {
  /** Listing id. */
  readonly id: string;

  /** Title. */
  readonly name: string;

  /** What the buyer should know. */
  readonly description: string;

  /** Price in whole rubles. */
  readonly price: number;

  /** Price label in rubles. */
  readonly priceLabel: string;

  /** Units still for sale. */
  readonly stock: number;

  /** Stock line. "Нет в наличии" when none remain. */
  readonly stockLabel: string;

  /** Review label in Russian. */
  readonly statusLabel: string;

  /** Tag ids selected on the form. Empty when the listing has no tags. */
  readonly tagIds: readonly string[];

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;
};

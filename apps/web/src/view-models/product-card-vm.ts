/** Listing as a catalog card. */
export type ProductCardVm = {
  /** Listing id. */
  readonly id: string;

  /** Title. */
  readonly name: string;

  /** Price in whole rubles. */
  readonly price: number;

  /** Price label in rubles. */
  readonly priceLabel: string;

  /** Units still for sale. */
  readonly stock: number;

  /** Stock line. "Нет в наличии" when none remain. */
  readonly stockLabel: string;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;

  /** Seller name. */
  readonly sellerName: string;

  /** Tag labels. Empty when the listing has no tags. */
  readonly tags: readonly string[];
};

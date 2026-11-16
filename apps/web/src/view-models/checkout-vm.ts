/** What the buyer confirms before a mock purchase. */
export type CheckoutVm = {
  /** Listing id. */
  readonly productId: string;

  /** Listing title. */
  readonly productName: string;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;

  /** Price label of the single item, which is the order total. */
  readonly totalLabel: string;
};

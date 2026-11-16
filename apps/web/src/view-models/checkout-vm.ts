/** What the buyer confirms before a mock purchase. */
export type CheckoutVm = {
  /** Listing id. */
  readonly productId: string;

  /** Listing title. */
  readonly productName: string;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;

  /** Seller name shown under the title. */
  readonly sellerName: string;

  /** Listing price, which is also the order total. */
  readonly totalLabel: string;

  /** Always the formatted zero. The order has no delivery charge. */
  readonly deliveryLabel: string;
};

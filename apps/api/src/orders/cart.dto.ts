/** One line in a buyer's cart. */
export type CartLineDto = {
  /** Listing id. */
  readonly productId: string;

  /** Current title. */
  readonly name: string;

  /** Current price in whole rubles. */
  readonly price: number;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;

  /** Units in the cart. */
  readonly quantity: number;

  /** Units still for sale. */
  readonly stock: number;

  /** True when the listing is approved and the quantity does not exceed stock. */
  readonly available: boolean;
};

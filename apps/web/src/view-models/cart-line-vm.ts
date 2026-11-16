/** One line the cart shows. */
export type CartLineVm = {
  /** Listing id. */
  readonly productId: string;

  /** Title. */
  readonly name: string;

  /** Cover image path. Empty when the listing has no pictures. */
  readonly image: string;

  /** Units in the cart. */
  readonly quantity: number;

  /** Units still for sale. */
  readonly stock: number;

  /** True when this line can be bought. */
  readonly available: boolean;

  /** Why the line cannot be bought. Empty when it can. */
  readonly note: string;

  /** Price of the units in this line. */
  readonly lineLabel: string;
};

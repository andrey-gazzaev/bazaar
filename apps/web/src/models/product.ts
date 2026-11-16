import type { Tag } from './tag';

/** Listing a seller offers. */
export type Product = {
  /** Listing id. */
  readonly id: string;

  /** Title shown on the card. */
  readonly name: string;

  /** What the buyer should know. */
  readonly description: string;

  /** Price in whole rubles. */
  readonly price: number;

  /** Account id of the seller. */
  readonly sellerId: string;

  /** Seller name shown on the card. */
  readonly sellerName: string;

  /** Image paths. Empty when the listing has no pictures. */
  readonly images: readonly string[];

  /** Tags on the listing. Empty when it has none. */
  readonly tags: readonly Tag[];
};

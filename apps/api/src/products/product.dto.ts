import type { TagDto } from '../tags/tag.dto';

/** Listing returned to the shop. */
export type ProductDto = {
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

  /** Public image paths, first one is the cover. Empty when none were saved. */
  readonly images: readonly string[];

  /** Tags on the listing. Empty when it has none. */
  readonly tags: readonly TagDto[];
};

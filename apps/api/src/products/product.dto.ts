import type { ReviewStatus } from '@prisma/client';
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

  /** Units still for sale. Zero means none can be bought. */
  readonly stock: number;

  /** Review state. Only an approved listing is public. */
  readonly status: ReviewStatus;

  /** Account id of the seller. */
  readonly sellerId: string;

  /** Seller name shown on the card. */
  readonly sellerName: string;

  /** Public image paths, first one is the cover. Empty when none were saved. */
  readonly images: readonly string[];

  /** Tags on the listing. Empty when it has none. */
  readonly tags: readonly TagDto[];
};

/** One page of the public catalog. */
export type ProductPageDto = {
  /** Approved listings on this page. Empty when the page is past the end. */
  readonly products: readonly ProductDto[];

  /** Page number, starting at 1. */
  readonly page: number;

  /** How many pages match the filter. Zero when nothing matches. */
  readonly pageCount: number;

  /** How many approved listings match the filter. */
  readonly total: number;

  /** Highest approved price in whole rubles, ignoring the filter. Zero when none exist. */
  readonly ceiling: number;
};

/** Listings waiting for an admin, and how many there are. */
export type ModerationQueueDto = {
  /** Pending listings, newest first. Empty when nothing is waiting. */
  readonly products: readonly ProductDto[];

  /** How many listings are waiting. Zero when the queue is empty. */
  readonly count: number;
};

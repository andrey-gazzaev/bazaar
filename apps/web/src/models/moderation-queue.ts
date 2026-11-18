import type { Product } from './product';

/** Pending listings an admin can open, and how many are waiting. */
export type ModerationQueue = {
  /** Listings waiting for review. Empty when nothing is waiting. */
  readonly products: readonly Product[];

  /** How many listings are waiting. Zero when the queue is empty. */
  readonly count: number;
};

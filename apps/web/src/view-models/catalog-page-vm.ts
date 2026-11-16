import type { ProductCardVm } from './product-card-vm';

/** One page of catalog cards. */
export type CatalogPageVm = {
  /** Cards on this page. Empty when the page has none. */
  readonly cards: readonly ProductCardVm[];

  /** Page number, starting at 1. */
  readonly page: number;

  /** How many pages match. Zero when nothing matches. */
  readonly pageCount: number;

  /** How many listings match. */
  readonly total: number;

  /** Highest approved price in whole rubles. Zero when none exist. */
  readonly ceiling: number;
};

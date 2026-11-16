import type { Product } from './product';

/** One page of the public catalog. */
export type CatalogPage = {
  /** Approved listings on this page. Empty when the page has none. */
  readonly products: readonly Product[];

  /** Page number, starting at 1. */
  readonly page: number;

  /** How many pages match. Zero when nothing matches. */
  readonly pageCount: number;

  /** How many listings match. */
  readonly total: number;

  /** Highest approved price in whole rubles, ignoring the filter. Zero when none exist. */
  readonly ceiling: number;
};

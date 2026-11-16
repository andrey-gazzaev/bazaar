import type { CatalogSort } from './catalog-sort';

/** Filters the catalog page reads from the address. */
export type CatalogQuery = {
  /** Title search. Empty matches every title. */
  readonly q: string;

  /** Tag name. Empty means every tag. */
  readonly tag: string;

  /** Price ceiling in whole rubles. Null means no ceiling. */
  readonly maxPrice: number | null;

  /** Sort key. */
  readonly sort: CatalogSort;

  /** Page number, starting at 1. */
  readonly page: number;
};

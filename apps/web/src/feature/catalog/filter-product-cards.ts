import type { ProductCardVm } from '@/view-models';

/** Limits which catalog cards stay visible. */
export type CardFilter = {
  /** Matched against the listing name. Empty matches every name. */
  readonly query: string;

  /** Tag name. Empty means every tag. */
  readonly tag: string;

  /** Whole rubles. Null means no ceiling. */
  readonly maxPrice: number | null;
};

/** Cards whose name, tag, and price stay inside the filter. */
export function filterProductCards(
  cards: readonly ProductCardVm[],
  filter: CardFilter,
): readonly ProductCardVm[] {
  const query = filter.query.trim().toLocaleLowerCase('ru');

  return cards.filter((card) => {
    const nameMatches = card.name.toLocaleLowerCase('ru').includes(query);
    const tagMatches = filter.tag === '' || card.tags.includes(filter.tag);
    const priceMatches = filter.maxPrice === null || card.price <= filter.maxPrice;

    return nameMatches && tagMatches && priceMatches;
  });
}

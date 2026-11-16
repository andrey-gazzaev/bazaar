import type { CatalogPage } from '@/models';
import type { CatalogPageVm } from '@/view-models';
import { mapProductCard } from '../product-card/map-product-card';

/** Card page for one catalog response. */
export function mapCatalogPage(page: CatalogPage): CatalogPageVm {
  return {
    cards: page.products.map(mapProductCard),
    page: page.page,
    pageCount: page.pageCount,
    total: page.total,
    ceiling: page.ceiling,
  };
}

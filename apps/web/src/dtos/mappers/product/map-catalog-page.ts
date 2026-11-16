import type { CatalogPage } from '@/models';
import type { CatalogPageDto } from '../../schemas/product/product-list.schema';
import { mapProduct } from './map-product';

/** Catalog page stored for the shop. */
export function mapCatalogPage(dto: CatalogPageDto): CatalogPage {
  return {
    products: dto.products.map(mapProduct),
    page: dto.page,
    pageCount: dto.pageCount,
    total: dto.total,
    ceiling: dto.ceiling,
  };
}

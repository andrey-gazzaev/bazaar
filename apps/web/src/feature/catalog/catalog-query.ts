import type { CatalogQuery, CatalogSort } from '@/models';

const sorts = new Set<CatalogSort>(['newest', 'price_asc', 'price_desc', 'name']);

/** Filters read from the catalog address. Missing values use the defaults. */
export function catalogQueryFromSearchParams(params: URLSearchParams): CatalogQuery {
  const sort = params.get('sort');
  const maxPrice = params.get('maxPrice');
  const page = Number(params.get('page'));
  const parsedMax = maxPrice === null || maxPrice === '' ? null : Number(maxPrice);

  return {
    q: params.get('q') ?? '',
    tag: params.get('tag') ?? '',
    maxPrice: parsedMax !== null && Number.isInteger(parsedMax) && parsedMax >= 0 ? parsedMax : null,
    sort: sort !== null && sorts.has(sort as CatalogSort) ? (sort as CatalogSort) : 'newest',
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  };
}

/** Address of the catalog for these filters. The first page omits the page parameter. */
export function catalogHref(query: CatalogQuery): string {
  const params = new URLSearchParams();

  if (query.q) params.set('q', query.q);
  if (query.tag) params.set('tag', query.tag);
  if (query.maxPrice !== null) params.set('maxPrice', String(query.maxPrice));
  if (query.sort !== 'newest') params.set('sort', query.sort);
  if (query.page > 1) params.set('page', String(query.page));

  const search = params.toString();

  return search === '' ? '/' : `/?${search}`;
}

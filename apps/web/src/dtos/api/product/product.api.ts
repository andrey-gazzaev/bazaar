import type { CatalogPage, CatalogQuery, NewProduct, Product, ProductPatch } from '@/models';
import { api } from '../../http';
import { mapCatalogPage } from '../../mappers/product/map-catalog-page';
import { mapProduct } from '../../mappers/product/map-product';
import { catalogPageSchema } from '../../schemas/product/product-list.schema';
import { productResponseSchema } from '../../schemas/product/product-response.schema';
import { productRowsSchema } from '../../schemas/product/product-rows.schema';

/** Catalog, a seller's listings, and the admin queue. */
export class ProductApi {
  /** One page of approved listings. */
  public async list(query: CatalogQuery): Promise<CatalogPage> {
    const params = new URLSearchParams();

    if (query.q) params.set('q', query.q);
    if (query.tag) params.set('tag', query.tag);
    if (query.maxPrice !== null) params.set('maxPrice', String(query.maxPrice));

    params.set('sort', query.sort);
    params.set('page', String(query.page));

    const { data } = await api.get(`/api/products?${params.toString()}`);

    return mapCatalogPage(catalogPageSchema.parse(data));
  }

  /** One listing. */
  public async load(id: string): Promise<Product> {
    const { data } = await api.get(`/api/products/${id}`);

    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Every listing of the signed-in seller. */
  public async mine(): Promise<readonly Product[]> {
    const { data } = await api.get('/api/products/mine');

    return productRowsSchema.parse(data).products.map(mapProduct);
  }

  /** Listings waiting for an admin. */
  public async moderation(): Promise<readonly Product[]> {
    const { data } = await api.get('/api/products/moderation');

    return productRowsSchema.parse(data).products.map(mapProduct);
  }

  /** Publishes a pending listing with its pictures. */
  public async create(input: NewProduct): Promise<Product> {
    const { data } = await api.post('/api/products', productBody(input));

    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Changes a listing the seller owns. */
  public async update(id: string, patch: ProductPatch): Promise<Product> {
    const { data } = await api.patch(`/api/products/${id}`, productBody(patch));

    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Makes one pending listing public. */
  public async approve(id: string): Promise<Product> {
    const { data } = await api.post(`/api/products/${id}/approve`);

    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Keeps one pending listing hidden. */
  public async reject(id: string): Promise<Product> {
    const { data } = await api.post(`/api/products/${id}/reject`);

    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Removes a listing the seller owns. */
  public async remove(id: string): Promise<void> {
    await api.delete(`/api/products/${id}`);
  }
}

/** Shared catalog client. */
export const productApi = new ProductApi();

function productBody(input: NewProduct | ProductPatch): FormData {
  const body = new FormData();

  body.set('name', input.name);
  body.set('description', input.description);
  body.set('price', String(input.price));
  body.set('stock', String(input.stock));
  body.set('tagIds', input.tagIds.join(','));

  for (const image of input.images) body.append('images', image);

  return body;
}

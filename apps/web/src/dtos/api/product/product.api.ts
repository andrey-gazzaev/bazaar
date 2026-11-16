import type { NewProduct, Product } from '@/models';
import { api } from '../../http';
import { mapProduct } from '../../mappers/product/map-product';
import { productListSchema } from '../../schemas/product/product-list.schema';
import { productResponseSchema } from '../../schemas/product/product-response.schema';

/** Catalog and a seller's listings. */
export class ProductApi {
  /** Newest listings. */
  public async list(): Promise<readonly Product[]> {
    const { data } = await api.get('/api/products');
    return productListSchema.parse(data).products.map(mapProduct);
  }

  /** One listing. */
  public async load(id: string): Promise<Product> {
    const { data } = await api.get(`/api/products/${id}`);
    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Publishes a listing with its pictures. */
  public async create(input: NewProduct): Promise<Product> {
    const body = new FormData();
    body.set('name', input.name);
    body.set('description', input.description);
    body.set('price', String(input.price));
    body.set('tagIds', input.tagIds.join(','));

    for (const image of input.images) body.append('images', image);

    const { data } = await api.post('/api/products', body);
    return mapProduct(productResponseSchema.parse(data).product);
  }

  /** Removes a listing the seller owns. */
  public async remove(id: string): Promise<void> {
    await api.delete(`/api/products/${id}`);
  }
}

/** Shared catalog client. */
export const productApi = new ProductApi();

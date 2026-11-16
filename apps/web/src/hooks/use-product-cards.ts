import { mapProductCard } from '@/mappers';
import { useProducts } from '@/queries';

/** Catalog cards for the current listings. */
export function useProductCards() {
  const products = useProducts();

  const cards = (products.data ?? []).map(mapProductCard);

  return { cards, isLoading: products.isLoading, error: products.error };
}

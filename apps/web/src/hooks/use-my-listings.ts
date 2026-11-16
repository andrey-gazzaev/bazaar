import { mapListing } from '@/mappers';
import { useMyProducts } from '@/queries';
import type { ListingVm } from '@/view-models';

/** The signed-in seller's listings. */
export function useMyListings(): {
  readonly listings: readonly ListingVm[];
  readonly isLoading: boolean;
  readonly error: Error | null;
} {
  const products = useMyProducts();

  return {
    listings: (products.data ?? []).map(mapListing),
    isLoading: products.isLoading,
    error: products.error,
  };
}

import { mapCheckout } from '@/mappers';
import { useProduct } from '@/queries';
import type { CheckoutVm } from '@/view-models';

/** Confirmation for one listing. `checkout` is null until the listing has loaded. */
export function useCheckout(productId: string): {
  readonly checkout: CheckoutVm | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
} {
  const product = useProduct(productId);

  const checkout = product.data ? mapCheckout(product.data) : null;

  return { checkout, isLoading: product.isLoading, error: product.error };
}

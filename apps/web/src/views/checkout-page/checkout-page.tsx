'use client';

import { Checkout } from '@/feature';

/** Delivery and mock purchase. */
export function CheckoutPage({ productId }: { readonly productId: string }) {
  return <Checkout productId={productId} />;
}

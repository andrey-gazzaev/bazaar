'use client';

import { ProductScreen } from '@/feature';

/** One listing. */
export function ProductPage({ productId }: { readonly productId: string }) {
  return <ProductScreen productId={productId} />;
}

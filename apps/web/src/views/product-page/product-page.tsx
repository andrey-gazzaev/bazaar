'use client';

import { memo } from 'react';
import { ProductScreen } from '@/feature';

/** One listing. */
const ProductPageComponent = function({ productId }: { readonly productId: string }) {
  return <ProductScreen productId={productId} />;
}

ProductPageComponent.displayName = 'ProductPage';
export const ProductPage = memo(ProductPageComponent);

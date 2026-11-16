'use client';

import { memo } from 'react';
import { ProductScreen } from '@/feature';

const productPageComponent = function ProductPageComponent({ productId }: { readonly productId: string }) {
  return <ProductScreen productId={productId} />;
};
productPageComponent.displayName = 'ProductPage';
/** One listing. */
export const ProductPage = memo(productPageComponent);

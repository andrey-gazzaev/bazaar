'use client';

import { memo } from 'react';
import { ProductForm } from '@/feature';

const sellPageComponent = function SellPageComponent() {
  return <ProductForm />;
};
sellPageComponent.displayName = 'SellPage';
/** Form for a new listing. */
export const SellPage = memo(sellPageComponent);

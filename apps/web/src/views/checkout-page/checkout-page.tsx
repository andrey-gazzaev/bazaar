'use client';

import { memo } from 'react';
import { Checkout } from '@/feature';

const checkoutPageComponent = function CheckoutPageComponent({ productId }: { readonly productId: string }) {
  return <Checkout productId={productId} />;
};
checkoutPageComponent.displayName = 'CheckoutPage';
/** Delivery and mock purchase. */
export const CheckoutPage = memo(checkoutPageComponent);

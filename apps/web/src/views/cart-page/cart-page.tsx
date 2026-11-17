'use client';

import { memo } from 'react';
import { Cart } from '@/feature';

/** Cart and checkout. */
const CartPageComponent = function() {
  return <Cart />;
}

CartPageComponent.displayName = 'CartPage';
export const CartPage = memo(CartPageComponent);

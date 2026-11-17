'use client';

import { memo } from 'react';
import { Listings } from '@/feature';

/** A seller's own listings. */
const ListingsPageComponent = function() {
  return <Listings />;
}

ListingsPageComponent.displayName = 'ListingsPage';
export const ListingsPage = memo(ListingsPageComponent);

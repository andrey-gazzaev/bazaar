'use client';

import { memo } from 'react';
import { TagAdmin } from '@/feature';

/** Tag administration. */
const AdminTagsPageComponent = function() {
  return <TagAdmin />;
}

AdminTagsPageComponent.displayName = 'AdminTagsPage';
export const AdminTagsPage = memo(AdminTagsPageComponent);

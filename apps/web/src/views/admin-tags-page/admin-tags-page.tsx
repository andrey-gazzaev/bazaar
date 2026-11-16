'use client';

import { memo } from 'react';
import { TagAdmin } from '@/feature';

const adminTagsPageComponent = function AdminTagsPageComponent() {
  return <TagAdmin />;
};
adminTagsPageComponent.displayName = 'AdminTagsPage';
/** Tag administration. */
export const AdminTagsPage = memo(adminTagsPageComponent);

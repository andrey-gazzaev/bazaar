'use client';

import { memo } from 'react';
import { UserAdmin } from '@/feature';

const adminUsersPageComponent = function AdminUsersPageComponent() {
  return <UserAdmin />;
};
adminUsersPageComponent.displayName = 'AdminUsersPage';
/** Account administration. */
export const AdminUsersPage = memo(adminUsersPageComponent);

'use client';

import { memo } from 'react';
import { UserAdmin } from '@/feature';

/** Account administration. */
const AdminUsersPageComponent = function() {
  return <UserAdmin />;
}

AdminUsersPageComponent.displayName = 'AdminUsersPage';
export const AdminUsersPage = memo(AdminUsersPageComponent);

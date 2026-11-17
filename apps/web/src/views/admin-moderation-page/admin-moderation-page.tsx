'use client';

import { memo } from 'react';
import { Moderation } from '@/feature';

/** Review queue. */
const AdminModerationPageComponent = function() {
  return <Moderation />;
}

AdminModerationPageComponent.displayName = 'AdminModerationPage';
export const AdminModerationPage = memo(AdminModerationPageComponent);

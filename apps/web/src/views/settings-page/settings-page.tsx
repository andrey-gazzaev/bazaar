'use client';

import { memo } from 'react';
import { Settings } from '@/feature';

/** Account details. */
const SettingsPageComponent = function() {
  return <Settings />;
}

SettingsPageComponent.displayName = 'SettingsPage';
export const SettingsPage = memo(SettingsPageComponent);

import { memo, type ReactNode } from 'react';
import styles from './icon.module.css';

/** Name of a decorative line icon. */
export type IconName = 'grid' | 'tag' | 'key' | 'search' | 'shop';

const figures: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  tag: (
    <>
      <path d="M10.5 4h6.8a1.2 1.2 0 0 1 1.2 1.2V12L11 20.7a1.6 1.6 0 0 1-2.3 0l-5.4-5.4a1.6 1.6 0 0 1 0-2.3L10.5 4z" />
      <circle cx="15.4" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.2 12H20.5M17.2 12v2.7M20.5 12v2.2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m15.8 15.8 4.2 4.2" />
    </>
  ),
  shop: (
    <>
      <path d="M4 10 6.2 4.5h11.6L20 10" />
      <path d="M4 10h16v9.5H4z" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
};

/** Decorative line icon. Hidden from assistive technology. */
const IconComponent = function({
  name,
}: {
  /** Which icon to show. */
  readonly name: IconName;
}) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {figures[name]}
    </svg>
  );
}

IconComponent.displayName = 'Icon';
export const Icon = memo(IconComponent);

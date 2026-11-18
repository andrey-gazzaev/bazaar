import { memo, type ReactNode } from 'react';
import styles from './icon.module.css';

/** Name of a decorative line icon. */
export type IconName = 'grid' | 'tag' | 'key' | 'search' | 'shop' | 'cart' | 'user' | 'users' | 'shield';

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
  cart: (
    <>
      <path d="M6.5 8.5h11l-.8 10.2H7.3L6.5 8.5z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.8 19c1.2-2.7 3.4-4 6.2-4s5 1.3 6.2 4" />
    </>
  ),
  users: (
    <>
      <path d="M15.5 19.5v-1.5a3.2 3.2 0 0 0-3.2-3.2H7.2A3.2 3.2 0 0 0 4 18v1.5" />
      <circle cx="9.2" cy="8.2" r="3" />
      <path d="M20 19.5v-1.3a3.1 3.1 0 0 0-2.3-3" />
      <path d="M15 5.4a3 3 0 0 1 0 5.7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.6 18.8 6.3v4.8c0 3.8-2.6 6.6-6.8 8.3-4.2-1.7-6.8-4.5-6.8-8.3V6.3L12 3.6z" />
      <path d="m9 12.1 2.1 2.1 4-4.2" />
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

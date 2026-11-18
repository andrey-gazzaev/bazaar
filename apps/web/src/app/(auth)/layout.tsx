import type { ReactNode } from 'react';
import { Center } from '@/ui';

/** Sign-in and registration, centered and without the sidebar. */
export default function AuthLayout({ children }: { readonly children: ReactNode }) {
  return <Center>{children}</Center>;
}

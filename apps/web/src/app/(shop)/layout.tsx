import { Suspense, type ReactNode } from 'react';
import { AccountMenu, ProfileMenu } from '@/feature';
import { Frame } from '../frame';

/** Shop chrome around every page except sign-in and registration. */
export default function ShopLayout({ children }: { readonly children: ReactNode }) {
  return (
    <Frame
      menu={(
        <Suspense fallback={null}>
          <AccountMenu />
        </Suspense>
      )}
      profile={(
        <Suspense fallback={null}>
          <ProfileMenu />
        </Suspense>
      )}
    >
      {children}
    </Frame>
  );
}

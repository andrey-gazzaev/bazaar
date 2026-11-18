import { Suspense, type ReactNode } from 'react';
import { AccountMenu, ProfileMenu } from '@/feature';
import { Frame } from './frame';
import { Providers } from './providers';
import './global.css';

/** Document title for the shop. */
export const metadata = {
  title: 'Базар',
  description: 'Маркетплейс с ролями, каталогом и оформлением заказа.',
};

/** Root document. */
export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}

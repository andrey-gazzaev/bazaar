import type { ReactNode } from 'react';
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

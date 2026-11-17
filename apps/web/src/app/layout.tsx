import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { readSessionUser } from '@/dtos/schemas/session/read-session-user';
import { Frame } from './frame';
import { Providers } from './providers';
import './global.css';

/** Document title for the shop. */
export const metadata = {
  title: 'Базар',
  description: 'Маркетплейс с ролями, каталогом и оформлением заказа.',
};

/** Root document. */
export default async function RootLayout({ children }: { readonly children: ReactNode }) {
  const jar = await cookies();
  const user = readSessionUser(jar.get('bazaar_user')?.value ?? null);

  return (
    <html lang="ru">
      <body>
        <Providers user={user}>
          <Frame>{children}</Frame>
        </Providers>
      </body>
    </html>
  );
}

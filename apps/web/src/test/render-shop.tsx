import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SessionProvider } from '@/context';
import type { SessionUser } from '@/models';
import { sessionKeys } from '@/queries/session/keys';

/** Renders a screen with the query cache and the signed-in person. */
export function renderShop(ui: ReactNode, user: SessionUser | null = null): RenderResult {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  client.setQueryData(sessionKeys.all, user);

  return render(
    <QueryClientProvider client={client}>
      <SessionProvider>{ui}</SessionProvider>
    </QueryClientProvider>,
  );
}

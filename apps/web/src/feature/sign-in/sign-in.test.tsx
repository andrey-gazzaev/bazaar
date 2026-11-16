import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SessionProvider } from '@/context';
import { SignIn } from './sign-in';

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: {
    current: vi.fn().mockResolvedValue(null),
    login: vi.fn(),
    register: vi.fn(),
    leave: vi.fn(),
  },
}));

describe('SignIn', () => {
  it('asks for email and password before calling the API', () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={client}>
        <SessionProvider>
          <SignIn />
        </SessionProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(screen.getByText('Введите email и пароль')).toBeInTheDocument();
  });
});

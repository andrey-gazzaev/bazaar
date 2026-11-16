import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SignIn } from './sign-in';

describe('SignIn', () => {
  it('asks for email and password before calling the API', () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <SignIn />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(screen.getByText('Введите email и пароль')).toBeInTheDocument();
  });
});

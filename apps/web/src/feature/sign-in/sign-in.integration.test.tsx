import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sessionApi } from '@/dtos/api/session/session.api';
import { renderShop } from '@/test/render-shop';
import { SignIn } from './sign-in';

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: { login: vi.fn(), register: vi.fn(), leave: vi.fn() },
}));

describe('SignIn integration', () => {
  beforeEach(() => {
    vi.mocked(sessionApi.login).mockResolvedValue({
      id: 'c1',
      email: 'client@bazaar.dev',
      name: 'Клиент',
      role: 'CLIENT',
    });
  });

  it('signs in with the email and password', async () => {
    const user = userEvent.setup();
    renderShop(<SignIn />);

    await user.type(screen.getByPlaceholderText('Email'), 'client@bazaar.dev');
    await user.type(screen.getByPlaceholderText('Пароль'), 'bazaar-client');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(sessionApi.login).toHaveBeenCalledWith({
      email: 'client@bazaar.dev',
      password: 'bazaar-client',
    });
  });
});

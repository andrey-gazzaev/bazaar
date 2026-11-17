import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { renderShop } from '@/test/render-shop';
import { TagAdmin } from './tag-admin';

const admin = {
  id: 'a1',
  email: 'admin@bazaar.dev',
  name: 'Админ',
  role: 'ADMIN',
} as const;

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: { current: vi.fn(), login: vi.fn(), register: vi.fn(), leave: vi.fn() },
}));

vi.mock('@/dtos/api/tag/tag.api', () => ({
  tagApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

describe('TagAdmin integration', () => {
  beforeEach(() => {
    vi.mocked(tagApi.list).mockResolvedValue([]);
    vi.mocked(tagApi.create).mockResolvedValue({ id: 't1', name: 'Книги' });
  });

  it('creates a tag from the admin form', async () => {
    const user = userEvent.setup();
    renderShop(<TagAdmin />, admin);

    await user.type(await screen.findByPlaceholderText('Название тега'), 'Книги');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(tagApi.create).toHaveBeenCalledWith('Книги');
  });
});

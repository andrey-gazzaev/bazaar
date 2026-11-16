import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productApi } from '@/dtos/api/product/product.api';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { Catalog } from './catalog';

vi.mock('@/dtos/api/product/product.api', () => ({
  productApi: {
    list: vi.fn(),
    load: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    mine: vi.fn(),
    moderation: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  },
}));

vi.mock('@/dtos/api/tag/tag.api', () => ({
  tagApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const listing = {
  id: 'p1',
  name: 'Льняная сумка',
  description: 'На каждый день',
  price: 2400,
  stock: 5,
  status: 'APPROVED' as const,
  sellerId: 's1',
  sellerName: 'Продавец',
  images: [],
  tags: [{ id: 't1', name: 'Дом' }],
};

describe('Catalog integration', () => {
  beforeEach(() => {
    vi.mocked(productApi.list).mockResolvedValue({
      products: [listing],
      page: 1,
      pageCount: 1,
      total: 1,
      ceiling: 2400,
    });
    vi.mocked(tagApi.list).mockResolvedValue([{ id: 't1', name: 'Дом' }]);
  });

  it('renders listings loaded from the API', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={client}>
        <Catalog />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('link', { name: /Льняная сумка/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дом' })).toBeInTheDocument();
    expect(productApi.list).toHaveBeenCalledOnce();
  });
});

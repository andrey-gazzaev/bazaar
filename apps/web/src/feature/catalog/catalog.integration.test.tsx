import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productApi } from '@/dtos/api/product/product.api';
import { Catalog } from './catalog';

vi.mock('@/dtos/api/product/product.api', () => ({
  productApi: {
    list: vi.fn(),
    load: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

const listing = {
  id: 'p1',
  name: 'Льняная сумка',
  description: 'На каждый день',
  price: 2400,
  sellerId: 's1',
  sellerName: 'Продавец',
  images: [],
  tags: [{ id: 't1', name: 'Дом' }],
};

describe('Catalog integration', () => {
  beforeEach(() => {
    vi.mocked(productApi.list).mockResolvedValue([listing]);
  });

  it('renders listings loaded from the API', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <Catalog />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('link', { name: /Льняная сумка/ })).toBeInTheDocument();
    expect(screen.getByText('Дом')).toBeInTheDocument();
    expect(productApi.list).toHaveBeenCalledOnce();
  });
});

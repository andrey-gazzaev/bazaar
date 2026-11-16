import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { productApi } from '@/dtos/api/product/product.api';
import { sessionApi } from '@/dtos/api/session/session.api';
import { renderShop } from '@/test/render-shop';
import { ProductScreen } from './product-screen';

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: { current: vi.fn(), login: vi.fn(), register: vi.fn(), leave: vi.fn() },
}));

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

vi.mock('@/dtos/api/cart/cart.api', () => ({
  cartApi: { list: vi.fn(), setItem: vi.fn(), remove: vi.fn() },
}));

describe('ProductScreen', () => {
  beforeEach(() => {
    vi.mocked(sessionApi.current).mockResolvedValue({
      id: 's1',
      email: 'seller@bazaar.dev',
      name: 'Продавец',
      role: 'SELLER',
    });
    vi.mocked(cartApi.list).mockResolvedValue([]);
    vi.mocked(productApi.load).mockResolvedValue({
      id: 'p1',
      name: 'Льняная сумка',
      description: 'На каждый день',
      price: 2400,
      stock: 5,
      status: 'PENDING',
      sellerId: 's1',
      sellerName: 'Продавец',
      images: [],
      tags: [],
    });
  });

  it('does not offer the cart for a hidden card', async () => {
    renderShop(<ProductScreen productId="p1" />);

    expect(await screen.findByRole('heading', { name: 'Льняная сумка' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'В корзину' })).not.toBeInTheDocument();
  });
});

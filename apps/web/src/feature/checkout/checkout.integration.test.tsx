import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { orderApi } from '@/dtos/api/order/order.api';
import { productApi } from '@/dtos/api/product/product.api';
import { sessionApi } from '@/dtos/api/session/session.api';
import { renderShop } from '@/test/render-shop';
import { Checkout } from './checkout';

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: { current: vi.fn(), login: vi.fn(), register: vi.fn(), leave: vi.fn() },
}));

vi.mock('@/dtos/api/product/product.api', () => ({
  productApi: { list: vi.fn(), load: vi.fn(), create: vi.fn(), remove: vi.fn() },
}));

vi.mock('@/dtos/api/order/order.api', () => ({
  orderApi: { create: vi.fn() },
}));

const listing = {
  id: 'p1',
  name: 'Льняная сумка',
  description: 'На каждый день',
  price: 2400,
  sellerId: 's1',
  sellerName: 'Продавец',
  images: ['/uploads/bag.jpg'],
  tags: [],
};

describe('Checkout integration', () => {
  beforeEach(() => {
    vi.mocked(sessionApi.current).mockResolvedValue({
      id: 'c1',
      email: 'client@bazaar.dev',
      name: 'Клиент',
      role: 'CLIENT',
    });
    vi.mocked(productApi.load).mockResolvedValue(listing);
    vi.mocked(orderApi.create).mockResolvedValue({
      id: 'o1',
      price: 2400,
      productId: 'p1',
      productName: 'Льняная сумка',
      recipientName: 'Мария Иванова',
      phone: '+79990001122',
      address: 'Казань, Баумана, 1',
    });
  });

  it('shows the total before the mock purchase and stores the delivery details', async () => {
    const user = userEvent.setup();
    renderShop(<Checkout productId="p1" />);

    expect(await screen.findByText(/2\s400\s₽/)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Кому доставить'), 'Мария Иванова');
    await user.type(screen.getByPlaceholderText('Телефон'), '+79990001122');
    await user.type(screen.getByPlaceholderText('Адрес'), 'Казань, Баумана, 1');
    await user.click(screen.getByRole('button', { name: 'Оформить заказ' }));

    expect(orderApi.create).toHaveBeenCalledWith('p1', {
      recipientName: 'Мария Иванова',
      phone: '+79990001122',
      address: 'Казань, Баумана, 1',
    });
    expect(await screen.findByText(/Заказ o1 оформлен/)).toBeInTheDocument();
  });
});

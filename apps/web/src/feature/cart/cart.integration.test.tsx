import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cartApi } from '@/dtos/api/cart/cart.api';
import { orderApi } from '@/dtos/api/order/order.api';
import { renderShop } from '@/test/render-shop';
import { Cart } from './cart';

const shopper = {
  id: 'c1',
  email: 'client@bazaar.dev',
  name: 'Клиент',
  role: 'CLIENT',
} as const;

vi.mock('@/dtos/api/session/session.api', () => ({
  sessionApi: { current: vi.fn(), login: vi.fn(), register: vi.fn(), leave: vi.fn() },
}));

vi.mock('@/dtos/api/cart/cart.api', () => ({
  cartApi: { list: vi.fn(), setItem: vi.fn(), remove: vi.fn() },
}));

vi.mock('@/dtos/api/order/order.api', () => ({
  orderApi: { create: vi.fn() },
}));

describe('Cart integration', () => {
  beforeEach(() => {
    vi.mocked(cartApi.list).mockResolvedValue([
      {
        productId: 'p1',
        name: 'Льняная сумка',
        price: 2400,
        image: '/uploads/bag.jpg',
        quantity: 1,
        stock: 5,
        available: true,
      },
    ]);
    vi.mocked(orderApi.create).mockResolvedValue([
      {
        id: 'o1',
        price: 2400,
        productId: 'p1',
        productName: 'Льняная сумка',
        recipientName: 'Мария Иванова',
        phone: '+79990001122',
        address: 'Казань, Баумана, 1',
      },
    ]);
  });

  it('shows the total before the mock purchase and stores the delivery details', async () => {
    const user = userEvent.setup();

    renderShop(<Cart />, shopper);

    expect(await screen.findByRole('heading', { name: 'Корзина' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Адрес доставки' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ваш заказ' })).toBeInTheDocument();
    expect(screen.getByText('Доставка')).toBeInTheDocument();
    expect(screen.getByText('Итого')).toBeInTheDocument();
    expect(screen.getByText('0 ₽')).toBeInTheDocument();
    expect(screen.getAllByText(/2\s400\s₽/)).toHaveLength(2);

    await user.type(screen.getByLabelText('Имя'), 'Мария Иванова');
    await user.type(screen.getByLabelText('Телефон'), '+79990001122');
    await user.selectOptions(screen.getByLabelText('Город'), 'Казань');
    await user.type(screen.getByLabelText('Улица и дом'), 'Баумана, 1');
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(orderApi.create).toHaveBeenCalledWith({
      recipientName: 'Мария Иванова',
      phone: '+7 (999) 000-11-22',
      address: 'Казань, Баумана, 1',
    });
    expect(await screen.findByText(/Заказ o1 оформлен/)).toBeInTheDocument();
  });

  it('shows a receipt that sums each confirmed line amount', async () => {
    const user = userEvent.setup();

    vi.mocked(cartApi.list).mockResolvedValue([
      {
        productId: 'shirt',
        name: 'Льняная рубашка',
        price: 3490,
        image: '',
        quantity: 2,
        stock: 8,
        available: true,
      },
      {
        productId: 'mug',
        name: 'Кружка',
        price: 890,
        image: '',
        quantity: 1,
        stock: 4,
        available: true,
      },
    ]);
    vi.mocked(orderApi.create).mockResolvedValue([
      {
        id: 'o1',
        price: 6980,
        productId: 'shirt',
        productName: 'Льняная рубашка',
        recipientName: 'Мария Иванова',
        phone: '+7 (999) 000-11-22',
        address: 'Казань, Баумана, 1',
      },
      {
        id: 'o2',
        price: 890,
        productId: 'mug',
        productName: 'Кружка',
        recipientName: 'Мария Иванова',
        phone: '+7 (999) 000-11-22',
        address: 'Казань, Баумана, 1',
      },
    ]);

    renderShop(<Cart />, shopper);

    expect(await screen.findByText(/6\s980\s₽/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Имя'), 'Мария Иванова');
    await user.type(screen.getByLabelText('Телефон'), '+79990001122');
    await user.selectOptions(screen.getByLabelText('Город'), 'Казань');
    await user.type(screen.getByLabelText('Улица и дом'), 'Баумана, 1');
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(await screen.findByText(/Сумма 7\s870\s₽/)).toBeInTheDocument();
  });
});

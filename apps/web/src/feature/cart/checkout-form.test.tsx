import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckoutForm } from './checkout-form';

const cart = {
  lines: [
    {
      productId: 'p1',
      name: 'Льняная сумка',
      image: '',
      quantity: 1,
      stock: 5,
      available: true,
      note: '',
      lineLabel: '2\u00a0400 ₽',
    },
  ],
  totalLabel: '2\u00a0400 ₽',
  deliveryLabel: '0 ₽',
  empty: false,
  ready: true,
};

describe('CheckoutForm', () => {
  it('shows the cart total and sends the delivery details', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CheckoutForm cart={cart} pending={false} onSubmit={onSubmit} onQuantity={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByRole('heading', { name: 'Адрес доставки' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ваш заказ' })).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toHaveValue('');
    expect(screen.getByPlaceholderText('+7 (___) ___-__-__')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Укажите улицу и номер дома')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Санкт-Петербург' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Казань' })).toBeInTheDocument();
    expect(screen.getByText('Льняная сумка')).toBeInTheDocument();
    expect(screen.getByText('Доставка')).toBeInTheDocument();
    expect(screen.getByText('Итого')).toBeInTheDocument();
    expect(screen.getByText('0 ₽')).toBeInTheDocument();
    expect(screen.getAllByText(/2\s400\s₽/)).toHaveLength(2);

    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Мария Иванова' } });
    fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '+79990001122' } });
    fireEvent.change(screen.getByLabelText('Город'), { target: { value: 'Казань' } });
    fireEvent.change(screen.getByLabelText('Улица и дом'), { target: { value: '  Баумана, 1  ' } });

    expect(screen.getByLabelText('Телефон')).toHaveValue('+7 (999) 000-11-22');

    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(onSubmit).toHaveBeenCalledWith({
      recipientName: 'Мария Иванова',
      phone: '+7 (999) 000-11-22',
      address: 'Казань, Баумана, 1',
    });
  });
});

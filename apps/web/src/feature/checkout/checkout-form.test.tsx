import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckoutForm } from './checkout-form';

describe('CheckoutForm', () => {
  it('shows the listing total and sends the delivery details', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CheckoutForm
        checkout={{ productId: 'p1', productName: 'Льняная сумка', image: '', totalLabel: '2\u00a0400 ₽' }}
        pending={false}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText('Итог')).toBeInTheDocument();
    expect(screen.getByText(/2\s400\s₽/)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Кому доставить'), { target: { value: 'Мария Иванова' } });
    fireEvent.change(screen.getByPlaceholderText('Телефон'), { target: { value: '+79990001122' } });
    fireEvent.change(screen.getByPlaceholderText('Адрес'), { target: { value: 'Казань, Баумана, 1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Оформить заказ' }));

    expect(onSubmit).toHaveBeenCalledWith({
      recipientName: 'Мария Иванова',
      phone: '+79990001122',
      address: 'Казань, Баумана, 1',
    });
  });
});

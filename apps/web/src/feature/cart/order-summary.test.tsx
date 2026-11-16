import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OrderSummary } from './order-summary';

describe('OrderSummary', () => {
  it('lowers a line above stock to the current stock', () => {
    const onQuantity = vi.fn();

    render(
      <OrderSummary
        cart={{
          lines: [
            {
              productId: 'p1',
              name: 'Льняная сумка',
              image: '',
              quantity: 5,
              stock: 2,
              available: false,
              note: 'Недостаточно товара',
              lineLabel: '12\u00a0000 ₽',
            },
          ],
          totalLabel: '12\u00a0000 ₽',
          deliveryLabel: '0 ₽',
          empty: false,
          ready: false,
        }}
        pending={false}
        onQuantity={onQuantity}
        onRemove={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Меньше Льняная сумка' }));

    expect(onQuantity).toHaveBeenCalledWith('p1', 2);
  });
});

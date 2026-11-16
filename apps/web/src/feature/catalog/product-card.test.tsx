import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  it('shows the name, price, and tag', () => {
    render(
      <ProductCard
        card={{
          id: 'p1',
          name: 'Льняная сумка',
          priceLabel: '2 400 ₽',
          image: '',
          sellerName: 'Продавец',
          tags: ['Дом'],
        }}
      />,
    );

    expect(screen.getByRole('link', { name: /Льняная сумка/ })).toHaveAttribute('href', '/products/p1');
    expect(screen.getByText('2 400 ₽')).toBeInTheDocument();
    expect(screen.getByText('Дом')).toBeInTheDocument();
    expect(screen.getByText('Продавец')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('calls the click handler', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Сохранить</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a link when href is set', () => {
    render(<Button href="/products/1/checkout">Купить</Button>);

    const link = screen.getByRole('link', { name: 'Купить' });

    expect(link).toHaveAttribute('href', '/products/1/checkout');
    expect(link).not.toHaveAttribute('type');
    expect(screen.queryByRole('button', { name: 'Купить' })).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductFields } from './product-fields';

describe('ProductFields', () => {
  it('requires a picture before publishing', () => {
    const onSubmit = vi.fn();
    render(<ProductFields tags={[{ id: 't1', name: 'Дом' }]} pending={false} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Название'), { target: { value: 'Сумка' } });
    fireEvent.change(screen.getByPlaceholderText('Описание'), { target: { value: 'Лён' } });
    fireEvent.change(screen.getByPlaceholderText('Цена, ₽'), { target: { value: '2400' } });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить товар' }));

    expect(screen.getByText('Добавьте хотя бы одну картинку')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

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
});

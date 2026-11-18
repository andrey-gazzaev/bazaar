import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDelayedPrice } from './use-delayed-price';

describe('useDelayedPrice', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the next price at once and writes it after a pause', () => {
    vi.useFakeTimers();
    const commit = vi.fn();
    const { result } = renderHook(() => useDelayedPrice(2400, commit));

    act(() => result.current.change(1000));
    act(() => result.current.change(800));

    expect(result.current.price).toBe(800);
    expect(commit).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(299));

    expect(commit).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));

    expect(commit).toHaveBeenCalledExactlyOnceWith(800);
  });

  it('keeps a newer price when an earlier one lands', () => {
    vi.useFakeTimers();
    const commit = vi.fn();
    const { result, rerender } = renderHook(
      ({ committed }) => useDelayedPrice(committed, commit),
      { initialProps: { committed: 2400 } },
    );

    act(() => result.current.change(1000));
    act(() => vi.advanceTimersByTime(300));

    act(() => result.current.change(800));
    rerender({ committed: 1000 });

    expect(result.current.price).toBe(800);

    act(() => vi.advanceTimersByTime(300));

    expect(commit).toHaveBeenLastCalledWith(800);
    expect(commit).toHaveBeenCalledTimes(2);
  });
});

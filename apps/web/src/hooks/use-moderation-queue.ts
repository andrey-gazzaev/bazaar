import { mapModerationItem } from '@/mappers';
import { useModeration } from '@/queries';
import type { ModerationItemVm } from '@/view-models';

/** Pending listings for an admin. */
export function useModerationQueue(): {
  readonly items: readonly ModerationItemVm[];
  readonly isLoading: boolean;
  readonly error: Error | null;
} {
  const products = useModeration();

  return {
    items: (products.data ?? []).map(mapModerationItem),
    isLoading: products.isLoading,
    error: products.error,
  };
}

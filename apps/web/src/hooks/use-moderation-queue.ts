import { mapModerationItem } from '@/mappers';
import { useModeration } from '@/queries';
import type { ModerationItemVm } from '@/view-models';

/** Pending listings for an admin. */
export function useModerationQueue(): {
  readonly items: readonly ModerationItemVm[];
  readonly isLoading: boolean;
  readonly error: Error | null;
} {
  const moderation = useModeration({ enabled: true, live: false });

  return {
    items: (moderation.data?.products ?? []).map(mapModerationItem),
    isLoading: moderation.isLoading,
    error: moderation.error,
  };
}

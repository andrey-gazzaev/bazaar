import { mapUserRow } from '@/mappers';
import { useUsers } from '@/queries';
import type { UserRowVm } from '@/view-models';

/** Admin rows for every account. `rows` is null until the list has loaded. */
export function useUserRows(): { readonly rows: readonly UserRowVm[] | null; readonly isLoading: boolean } {
  const users = useUsers();

  const rows = users.data === undefined ? null : users.data.map(mapUserRow);

  return { rows, isLoading: users.isLoading };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/dtos/api/user/user.api';
import type { UserPatch } from '@/models';
import { userKeys } from '../keys';

/** Changes an account and refreshes the list. */
export function useUpdateUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; patch: UserPatch }) => userApi.update(input.id, input.patch),
    onSuccess: () => client.invalidateQueries({ queryKey: userKeys.all }),
  });
}

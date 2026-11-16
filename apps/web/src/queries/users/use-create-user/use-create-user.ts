import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/dtos/api/user/user.api';
import type { UserDraft } from '@/models';
import { userKeys } from '../keys';

/** Creates an account and refreshes the list. */
export function useCreateUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UserDraft) => userApi.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: userKeys.all }),
  });
}

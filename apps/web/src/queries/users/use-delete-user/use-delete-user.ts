import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/dtos/api/user/user.api';
import { userKeys } from '../keys';

/** Removes an account and refreshes the list. */
export function useDeleteUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: userKeys.all }),
  });
}

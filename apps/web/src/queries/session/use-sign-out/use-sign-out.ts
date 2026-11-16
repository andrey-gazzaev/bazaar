import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/dtos/api/session/session.api';
import { sessionKeys } from '../keys';

/** Drops the session. */
export function useSignOut() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => sessionApi.leave(),
    onSuccess: () => {
      client.setQueryData(sessionKeys.all, null);
    },
  });
}

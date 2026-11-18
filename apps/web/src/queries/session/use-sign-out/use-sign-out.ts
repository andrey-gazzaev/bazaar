import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/dtos/api/session/session.api';
import { cartKeys } from '../../cart/keys';

/** Drops the session. */
export function useSignOut() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => sessionApi.leave(),
    onSuccess: () => {
      client.removeQueries({ queryKey: cartKeys.all });
    },
  });
}

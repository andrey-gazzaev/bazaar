import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/dtos/api/session/session.api';
import type { RegisterInput } from '@/models';
import { cartKeys } from '../../cart/keys';
import { sessionKeys } from '../keys';

/** Creates an account and stores the person. */
export function useSignUp() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => sessionApi.register(input),
    onSuccess: (user) => {
      client.setQueryData(sessionKeys.all, user);
      client.removeQueries({ queryKey: cartKeys.all });
    },
  });
}

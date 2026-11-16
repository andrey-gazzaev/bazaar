import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/dtos/api/session/session.api';
import type { Credentials } from '@/models';
import { sessionKeys } from '../keys';

/** Opens a session and stores the person. */
export function useSignIn() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: Credentials) => sessionApi.login(input),
    onSuccess: (user) => {
      client.setQueryData(sessionKeys.all, user);
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '@/dtos/api/session/session.api';
import { sessionKeys } from '../keys';

/** Person for the current cookie. */
export function useSession() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => sessionApi.current(),
  });
}

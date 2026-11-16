import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/dtos/api/user/user.api';
import { userKeys } from '../keys';

/** Every account. */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => userApi.list(),
  });
}

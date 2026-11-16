import { useQuery } from '@tanstack/react-query';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { tagKeys } from '../keys';

/** Every tag. */
export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: () => tagApi.list(),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { tagKeys } from '../keys';

/** Removes a tag and refreshes the catalog. */
export function useDeleteTag() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagApi.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

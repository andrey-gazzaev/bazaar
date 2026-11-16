import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { tagKeys } from '../keys';

/** Renames a tag and refreshes the catalog. */
export function useUpdateTag() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name: string }) => tagApi.update(input.id, input.name),
    onSuccess: () => client.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

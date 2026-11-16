import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '@/dtos/api/tag/tag.api';
import { tagKeys } from '../keys';

/** Adds a tag and refreshes the catalog. */
export function useCreateTag() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => tagApi.create(name),
    onSuccess: () => client.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

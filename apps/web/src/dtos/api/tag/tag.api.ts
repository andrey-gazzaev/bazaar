import type { Tag } from '@/models';
import { api } from '../../http';
import { mapTag } from '../../mappers/tag/map-tag';
import { tagListSchema } from '../../schemas/tag/tag-list.schema';
import { tagResponseSchema } from '../../schemas/tag/tag-response.schema';

/** Tag catalog. */
export class TagApi {
  /** Every tag. */
  public async list(): Promise<readonly Tag[]> {
    const { data } = await api.get('/api/tags');
    return tagListSchema.parse(data).tags.map(mapTag);
  }

  /** Adds a tag. */
  public async create(name: string): Promise<Tag> {
    const { data } = await api.post('/api/tags', { name });
    return mapTag(tagResponseSchema.parse(data).tag);
  }

  /** Renames a tag. */
  public async update(id: string, name: string): Promise<Tag> {
    const { data } = await api.patch(`/api/tags/${id}`, { name });
    return mapTag(tagResponseSchema.parse(data).tag);
  }

  /** Removes a tag. */
  public async remove(id: string): Promise<void> {
    await api.delete(`/api/tags/${id}`);
  }
}

/** Shared tag client. */
export const tagApi = new TagApi();

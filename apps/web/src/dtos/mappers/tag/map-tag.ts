import type { Tag } from '@/models';
import type { TagDto } from '../../schemas/tag/tag.schema';

/** Tag stored for the shop. */
export function mapTag(dto: TagDto): Tag {
  return { id: dto.id, name: dto.name };
}

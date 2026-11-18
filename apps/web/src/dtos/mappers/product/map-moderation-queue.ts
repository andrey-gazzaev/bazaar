import type { ModerationQueue } from '@/models';
import type { ModerationQueueDto } from '../../schemas/product/moderation-queue.schema';
import { mapProduct } from './map-product';

/** Pending queue stored for the shop. */
export function mapModerationQueue(dto: ModerationQueueDto): ModerationQueue {
  return {
    products: dto.products.map(mapProduct),
    count: dto.count,
  };
}

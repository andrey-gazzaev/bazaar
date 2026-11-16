import type { ReviewStatus } from '@/models';

const labels: Record<ReviewStatus, string> = {
  PENDING: 'На модерации',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
};

/** Russian name of a review state. */
export function formatReviewStatus(status: ReviewStatus): string {
  return labels[status];
}

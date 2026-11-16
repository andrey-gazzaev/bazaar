import type { Role } from '@/models';

const labels: Record<Role, string> = {
  ADMIN: 'Админ',
  SELLER: 'Продавец',
  CLIENT: 'Клиент',
};

/** Russian name of a role. */
export function formatRole(role: Role): string {
  return labels[role];
}

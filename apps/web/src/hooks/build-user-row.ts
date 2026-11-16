import type { SessionUser } from '@/models';
import { formatRole } from '@/services';
import type { UserRowVm } from '@/view-models';

/** Admin row for one account. */
export function buildUserRow(user: SessionUser): UserRowVm {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleLabel: formatRole(user.role),
  };
}

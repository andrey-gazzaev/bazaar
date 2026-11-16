import type { SessionUser, UserDraft } from '@/models';
import { formatRole } from '@/services';
import type { UserRowVm } from '@/view-models';

/** Admin row for one account. */
export function mapUserRow(user: SessionUser): UserRowVm {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleLabel: formatRole(user.role),
  };
}

/** Account draft opened from an admin row. The password stays empty. */
export function mapUserDraft(row: UserRowVm): UserDraft {
  return {
    name: row.name,
    email: row.email,
    password: '',
    role: row.role,
  };
}

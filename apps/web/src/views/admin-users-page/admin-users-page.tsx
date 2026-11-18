import { UserAdmin } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Account administration. */
export async function AdminUsersPage() {
  const user = await getSessionUser();

  return <UserAdmin user={user} />;
}

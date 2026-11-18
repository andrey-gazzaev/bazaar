import { TagAdmin } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Tag administration. */
export async function AdminTagsPage() {
  const user = await getSessionUser();

  return <TagAdmin user={user} />;
}

import { Moderation } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Review queue. */
export async function AdminModerationPage() {
  const user = await getSessionUser();

  return <Moderation user={user} />;
}

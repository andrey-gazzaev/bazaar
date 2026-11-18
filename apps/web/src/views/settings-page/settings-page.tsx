import { Settings } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Account details. */
export async function SettingsPage() {
  const user = await getSessionUser();

  return <Settings user={user} />;
}

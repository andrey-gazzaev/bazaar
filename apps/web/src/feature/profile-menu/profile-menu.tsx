import { getSessionUser } from '@/services/get-session-user';
import { ProfileMenuButton } from './profile-menu-button';

/** The signed-in person's name, settings, and sign-out. */
export async function ProfileMenu() {
  const user = await getSessionUser();

  if (!user) return null;

  return <ProfileMenuButton name={user.name} />;
}

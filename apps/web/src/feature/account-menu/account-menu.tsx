import { getSessionUser } from '@/services/get-session-user';
import { AccountMenuNav } from './account-menu-nav';

/** Links for the signed-in role. Guests get sign-in and registration. */
export async function AccountMenu() {
  const user = await getSessionUser();

  return <AccountMenuNav user={user} />;
}

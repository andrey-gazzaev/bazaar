import { redirect } from 'next/navigation';
import { SignIn } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Sign-in screen. */
export async function SignInPage() {
  const user = await getSessionUser();

  if (user) redirect('/');

  return <SignIn />;
}

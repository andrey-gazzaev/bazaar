import { redirect } from 'next/navigation';
import { SignUp } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Registration screen. */
export async function SignUpPage() {
  const user = await getSessionUser();

  if (user) redirect('/');

  return <SignUp />;
}

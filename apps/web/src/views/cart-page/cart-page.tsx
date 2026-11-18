import { Cart } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** Cart and checkout. */
export async function CartPage() {
  const user = await getSessionUser();

  return <Cart user={user} />;
}

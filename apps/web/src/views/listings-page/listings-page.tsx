import { Listings } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** A seller's own listings. */
export async function ListingsPage() {
  const user = await getSessionUser();

  return <Listings user={user} />;
}

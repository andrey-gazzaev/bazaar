import { ProductScreen } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** One listing. */
export async function ProductPage({
  params,
}: {
  /** Listing id from the route. */
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  return <ProductScreen productId={id} user={user} />;
}

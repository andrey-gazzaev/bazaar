import { ProductScreen } from '@/feature';
import { getSessionUser } from '@/services/get-session-user';

/** One listing. */
export async function ProductPage({
  productId,
}: {
  /** Listing to show. */
  readonly productId: string;
}) {
  const user = await getSessionUser();

  return <ProductScreen productId={productId} user={user} />;
}

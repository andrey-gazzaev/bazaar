import { CheckoutPage } from '@/views';

/** Checkout route for one listing. */
export default async function Page({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckoutPage productId={id} />;
}

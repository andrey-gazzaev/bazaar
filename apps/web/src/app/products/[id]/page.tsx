import { ProductPage } from '@/views';

/** Listing route. */
export default async function Page({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPage productId={id} />;
}

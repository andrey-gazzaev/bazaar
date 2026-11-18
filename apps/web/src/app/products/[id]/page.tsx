import { Suspense } from 'react';
import { ProductPage } from '@/views';

/** Listing route. */
export default async function Page({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <ProductPage productId={id} />
    </Suspense>
  );
}

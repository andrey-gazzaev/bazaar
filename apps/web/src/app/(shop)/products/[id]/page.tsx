import { Suspense } from 'react';
import { ProductPage } from '@/views';

/** Listing route. */
export default function Page({ params }: { readonly params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <ProductPage params={params} />
    </Suspense>
  );
}

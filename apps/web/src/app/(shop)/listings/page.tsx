import { Suspense } from 'react';
import { ListingsPage } from '@/views';

/** Seller listings route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <ListingsPage />
    </Suspense>
  );
}

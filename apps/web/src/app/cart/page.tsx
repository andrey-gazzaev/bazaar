import { Suspense } from 'react';
import { CartPage } from '@/views';

/** Cart route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <CartPage />
    </Suspense>
  );
}

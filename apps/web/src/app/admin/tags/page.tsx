import { Suspense } from 'react';
import { AdminTagsPage } from '@/views';

/** Tag administration route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <AdminTagsPage />
    </Suspense>
  );
}

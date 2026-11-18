import { Suspense } from 'react';
import { AdminUsersPage } from '@/views';

/** Account administration route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <AdminUsersPage />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { AdminModerationPage } from '@/views';

/** Moderation route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <AdminModerationPage />
    </Suspense>
  );
}

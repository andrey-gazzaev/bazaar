import { Suspense } from 'react';
import { SettingsPage } from '@/views';

/** Settings route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <SettingsPage />
    </Suspense>
  );
}

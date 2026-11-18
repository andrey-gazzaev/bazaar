import { Suspense } from 'react';
import { SignUpPage } from '@/views';

/** Registration route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <SignUpPage />
    </Suspense>
  );
}

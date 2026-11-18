import { Suspense } from 'react';
import { SignInPage } from '@/views';

/** Sign-in route. */
export default function Page() {
  return (
    <Suspense fallback={<p className="muted">Загрузка…</p>}>
      <SignInPage />
    </Suspense>
  );
}

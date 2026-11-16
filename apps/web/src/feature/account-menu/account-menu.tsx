'use client';

import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/context';
import { useSignOut } from '@/queries';
import { Button } from '@/ui';
import styles from './account-menu.module.css';

/** Who is signed in, and the links for that role. */
export function AccountMenu() {
  const session = useSessionContext();
  const signOut = useSignOut();
  const router = useRouter();

  async function leave() {
    await signOut.mutateAsync();
    router.push('/');
  }

  if (session.isLoading) return <span className="muted">…</span>;

  if (!session.user) {
    return (
      <span className={styles.menu}>
        <a href="/sign-in">Войти</a>
        <a href="/sign-up">Регистрация</a>
      </span>
    );
  }

  return (
    <span className={styles.menu}>
      <span className={styles.name}>{session.user.name}</span>
      {session.user.role === 'SELLER' ? <a href="/sell">Продать</a> : null}
      {session.user.role === 'ADMIN' ? <a href="/admin/users">Пользователи</a> : null}
      {session.user.role === 'ADMIN' ? <a href="/admin/tags">Теги</a> : null}
      <Button variant="ghost" onClick={() => void leave()}>
        Выйти
      </Button>
    </span>
  );
}

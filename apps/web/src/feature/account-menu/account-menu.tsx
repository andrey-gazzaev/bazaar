'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSessionContext } from '@/context';
import { useSignOut } from '@/queries';
import { Button, Icon, NavItem } from '@/ui';
import styles from './account-menu.module.css';

function catalogSelected(pathname: string): boolean {
  return pathname === '/' || pathname === '/products' || pathname.startsWith('/products/');
}

/** Who is signed in, and the links for that role. */
export function AccountMenu() {
  const session = useSessionContext();
  const signOut = useSignOut();
  const router = useRouter();
  const pathname = usePathname();

  async function leave() {
    await signOut.mutateAsync();
    router.push('/');
  }

  if (session.isLoading) return <span className="muted">…</span>;

  const catalog = (
    <NavItem href="/" selected={catalogSelected(pathname)} icon={<Icon name="grid" />}>
      Каталог
    </NavItem>
  );

  if (!session.user) {
    return (
      <div className={styles.menu}>
        {catalog}

        <div className={styles.guest}>
          <NavItem href="/sign-in" selected={pathname === '/sign-in'} icon={<Icon name="key" />}>
            Войти
          </NavItem>
          <NavItem href="/sign-up" selected={pathname === '/sign-up'}>
            Регистрация
          </NavItem>
        </div>
      </div>
    );
  }

  const seller = session.user.role === 'SELLER';
  const admin = session.user.role === 'ADMIN';

  return (
    <div className={styles.menu}>
      {catalog}

      {seller ? (
        <NavItem href="/sell" selected={pathname === '/sell'} icon={<Icon name="tag" />}>
          Продать
        </NavItem>
      ) : null}

      {admin ? (
        <NavItem href="/admin/users" selected={pathname === '/admin/users'}>
          Пользователи
        </NavItem>
      ) : null}

      {admin ? (
        <NavItem href="/admin/tags" selected={pathname === '/admin/tags'} icon={<Icon name="tag" />}>
          Теги
        </NavItem>
      ) : null}

      <span className={styles.name}>{session.user.name}</span>
      <Button className={styles.leave} variant="ghost" onClick={() => void leave()}>
        Выйти
      </Button>
    </div>
  );
}

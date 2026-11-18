'use client';

import { memo, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { SessionUser } from '@/models';
import { Icon, NavItem } from '@/ui';
import styles from './account-menu.module.css';

function catalogSelected(pathname: string): boolean {
  return pathname === '/' || pathname === '/products' || pathname.startsWith('/products/');
}

/** Role links. The signed-in person comes from the user cookie. */
const AccountMenuNavComponent = function({
  user,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;
}) {
  const pathname = usePathname();

  const catalog = useMemo(() => (
    <NavItem href="/" selected={catalogSelected(pathname)} icon={<Icon name="grid" />}>
      Каталог
    </NavItem>
  ), [pathname]);

  if (!user) {
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

  const seller = user.role === 'SELLER';
  const admin = user.role === 'ADMIN';
  const shopper = user.role !== 'ADMIN';

  return (
    <div className={styles.menu}>
      {catalog}

      {shopper ? (
        <NavItem href="/cart" selected={pathname === '/cart'}>
          Корзина
        </NavItem>
      ) : null}

      {seller ? (
        <NavItem href="/listings" selected={pathname === '/listings'} icon={<Icon name="tag" />}>
          Мои объявления
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

      {admin ? (
        <NavItem href="/admin/moderation" selected={pathname === '/admin/moderation'}>
          Модерация
        </NavItem>
      ) : null}
    </div>
  );
};

AccountMenuNavComponent.displayName = 'AccountMenuNav';
export const AccountMenuNav = memo(AccountMenuNavComponent);

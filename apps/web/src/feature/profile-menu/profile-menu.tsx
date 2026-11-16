'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSessionContext } from '@/context';
import { useSignOut } from '@/queries';
import { Button } from '@/ui';
import styles from './profile-menu.module.css';

/** The signed-in person's name, settings, and sign-out. */
export function ProfileMenu() {
  const session = useSessionContext();
  const signOut = useSignOut();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (session.isLoading || !session.user) return null;

  async function leave() {
    await signOut.mutateAsync();
    setOpen(false);
    router.push('/');
  }

  return (
    <div className={styles.slot}>
      <div className={styles.wrap}>
        <Button variant="ghost" onClick={() => setOpen((current) => !current)}>
          {session.user.name}
        </Button>

        {open ? (
          <div className={styles.menu}>
            <Button variant="ghost" href="/settings">
              Настройки
            </Button>
            <Button variant="ghost" onClick={() => void leave()}>
              Выйти
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

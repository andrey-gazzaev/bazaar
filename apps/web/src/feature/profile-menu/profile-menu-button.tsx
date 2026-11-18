'use client';

import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useSignOut } from '@/queries';
import { Button } from '@/ui';
import styles from './profile-menu.module.css';

/** Name, settings, and sign-out for the signed-in person. */
const ProfileMenuButtonComponent = function({
  name,
}: {
  /** Name shown on the account button. */
  readonly name: string;
}) {
  const signOut = useSignOut();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function leave() {
    await signOut.mutateAsync();
    setOpen(false);
    router.refresh();
    router.push('/');
  }

  return (
    <div className={styles.slot}>
      <div className={styles.wrap}>
        <Button variant="ghost" onClick={() => setOpen((current) => !current)}>
          {name}
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
};

ProfileMenuButtonComponent.displayName = 'ProfileMenuButton';
export const ProfileMenuButton = memo(ProfileMenuButtonComponent);

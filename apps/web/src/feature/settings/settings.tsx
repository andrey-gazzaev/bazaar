'use client';

import { memo } from 'react';
import type { SessionUser } from '@/models';
import { formatRole } from '@/services';
import { Page, Panel } from '@/ui';
import styles from './settings.module.css';

/** Name, email, and role. Nothing here can be edited. */
const SettingsComponent = function({
  user,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;
}) {
  if (!user) {
    return (
      <Page>
        <Panel>
          <h1>Настройки</h1>
          <p className="muted">
            <a href="/sign-in">Войдите</a>, чтобы открыть настройки.
          </p>
        </Panel>
      </Page>
    );
  }

  return (
    <Page>
      <Panel className={styles.panel}>
        <h1>Настройки</h1>

        <dl className={styles.rows}>
          <div>
            <dt>Имя</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>{formatRole(user.role)}</dd>
          </div>
        </dl>
      </Panel>
    </Page>
  );
}

SettingsComponent.displayName = 'Settings';
export const Settings = memo(SettingsComponent);

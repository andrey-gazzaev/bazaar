'use client';

import { useSessionContext } from '@/context';
import { formatRole } from '@/services';
import { Page, Panel } from '@/ui';
import styles from './settings.module.css';

/** Name, email, and role. Nothing here can be edited. */
export function Settings() {
  const session = useSessionContext();

  if (!session.user) {
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
            <dd>{session.user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{session.user.email}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>{formatRole(session.user.role)}</dd>
          </div>
        </dl>
      </Panel>
    </Page>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useSessionContext } from '@/context';
import { buildUserRow } from '@/hooks';
import type { UserDraft } from '@/models';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '@/queries';
import { Page, Panel } from '@/ui';
import styles from './user-admin.module.css';
import { UserForm } from './user-form';
import { UserTable } from './user-table';

const blank: UserDraft = { name: '', email: '', password: '', role: 'CLIENT' };

/** Admin list and editor for accounts. */
export function UserAdmin() {
  const session = useSessionContext();
  const users = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [draft, setDraft] = useState<UserDraft>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => (users.data ?? []).map(buildUserRow), [users.data]);

  if (session.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (session.user?.role !== 'ADMIN') {
    return (
      <Page>
        <Panel>
          <h1>Пользователи</h1>
          <p className="muted">Список доступен только админу.</p>
        </Panel>
      </Page>
    );
  }

  function edit(id: string) {
    const user = users.data?.find((item) => item.id === id);
    if (!user) return;

    setEditingId(id);
    setDraft({ name: user.name, email: user.email, password: '', role: user.role });
    setError(null);
  }

  async function submit() {
    const name = draft.name.trim();
    const email = draft.email.trim();

    if (name.length < 2 || !email || (!editingId && draft.password.length < 8)) {
      setError('Имя, email и пароль от 8 символов');
      return;
    }

    setError(null);

    try {
      if (editingId) {
        await updateUser.mutateAsync({
          id: editingId,
          patch: {
            name,
            email,
            role: draft.role,
            ...(draft.password ? { password: draft.password } : {}),
          },
        });
      } else {
        await createUser.mutateAsync({ name, email, password: draft.password, role: draft.role });
      }

      setDraft(blank);
      setEditingId(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось сохранить пользователя');
    }
  }

  async function remove(id: string) {
    setError(null);

    try {
      await deleteUser.mutateAsync(id);
      if (editingId === id) {
        setEditingId(null);
        setDraft(blank);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось удалить пользователя');
    }
  }

  return (
    <Page>
      <div className={styles.layout}>
        <h1>Пользователи</h1>

        <Panel>
          <UserForm
            draft={draft}
            editing={editingId !== null}
            pending={createUser.isPending || updateUser.isPending}
            onChange={setDraft}
            onSubmit={submit}
          />
          {error ? <p className="status">{error}</p> : null}
        </Panel>

        {users.isLoading ? <p className="muted">Загрузка…</p> : null}
        {users.data ? <UserTable rows={rows} onEdit={edit} onDelete={(id) => void remove(id)} /> : null}
      </div>
    </Page>
  );
}

'use client';

import { memo, useState } from 'react';
import { useUserRows } from '@/hooks';
import { mapUserDraft } from '@/mappers';
import type { SessionUser, UserDraft } from '@/models';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/queries';
import { Page, Panel } from '@/ui';
import styles from './user-admin.module.css';
import { UserForm } from './user-form';
import { UserTable } from './user-table';

const blank: UserDraft = { name: '', email: '', password: '', role: 'CLIENT' };

/** Admin list and editor for accounts. */
const UserAdminComponent = function({
  user,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;
}) {
  const { rows, isLoading } = useUserRows();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [draft, setDraft] = useState<UserDraft>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== 'ADMIN') {
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
    const row = rows?.find((item) => item.id === id);
    if (!row) return;

    setEditingId(id);
    setDraft(mapUserDraft(row));
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

        {isLoading ? <p className="muted">Загрузка…</p> : null}
        {rows ? <UserTable rows={rows} onEdit={edit} onDelete={(id) => void remove(id)} /> : null}
      </div>
    </Page>
  );
}

UserAdminComponent.displayName = 'UserAdmin';
export const UserAdmin = memo(UserAdminComponent);

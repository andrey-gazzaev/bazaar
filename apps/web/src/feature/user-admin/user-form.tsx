'use client';

import type { FormEvent } from 'react';
import type { Role, UserDraft } from '@/models';
import { Button, SelectField, TextField } from '@/ui';
import styles from './user-admin.module.css';

/** Fields for creating or changing an account. */
export function UserForm({
  draft,
  editing,
  pending,
  onChange,
  onSubmit,
}: {
  readonly draft: UserDraft;
  readonly editing: boolean;
  readonly pending: boolean;
  readonly onChange: (draft: UserDraft) => void;
  readonly onSubmit: () => Promise<void>;
}) {
  async function submit(event: FormEvent) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={(event) => void submit(event)}>
      <h2>{editing ? 'Изменить пользователя' : 'Новый пользователь'}</h2>

      <label>
        <span className="sr">Имя</span>
        <TextField
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          placeholder="Имя"
          name="name"
        />
      </label>

      <label>
        <span className="sr">Email</span>
        <TextField
          value={draft.email}
          onChange={(event) => onChange({ ...draft, email: event.target.value })}
          placeholder="Email"
          name="email"
          type="email"
        />
      </label>

      <label>
        <span className="sr">Пароль</span>
        <TextField
          value={draft.password}
          onChange={(event) => onChange({ ...draft, password: event.target.value })}
          placeholder={editing ? 'Новый пароль, если нужно сменить' : 'Пароль'}
          name="password"
          type="password"
        />
      </label>

      <label>
        <span className="sr">Роль</span>
        <SelectField
          value={draft.role}
          onChange={(event) => onChange({ ...draft, role: event.target.value as Role })}
          name="role"
        >
          <option value="CLIENT">Клиент</option>
          <option value="SELLER">Продавец</option>
          <option value="ADMIN">Админ</option>
        </SelectField>
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? 'Сохраняем…' : editing ? 'Сохранить' : 'Создать'}
      </Button>
    </form>
  );
}

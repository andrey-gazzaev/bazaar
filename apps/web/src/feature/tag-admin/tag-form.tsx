'use client';

import { memo, type FormEvent } from 'react';
import { Button, TextField } from '@/ui';
import styles from './tag-admin.module.css';

/** Name field for a new or renamed tag. */
const TagFormComponent = function({
  name,
  editing,
  pending,
  onName,
  onSubmit,
}: {
  readonly name: string;
  readonly editing: boolean;
  readonly pending: boolean;
  readonly onName: (name: string) => void;
  readonly onSubmit: () => Promise<void>;
}) {
  async function submit(event: FormEvent) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={(event) => void submit(event)}>
      <label>
        <span className="sr">Название тега</span>
        <TextField value={name} onChange={(event) => onName(event.target.value)} placeholder="Название тега" name="tag" />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? 'Сохраняем…' : editing ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  );
}

TagFormComponent.displayName = 'TagForm';
export const TagForm = memo(TagFormComponent);

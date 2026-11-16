'use client';

import { memo, useState } from 'react';
import { useSessionContext } from '@/context';
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@/queries';
import { Page, Panel } from '@/ui';
import styles from './tag-admin.module.css';
import { TagForm } from './tag-form';
import { TagList } from './tag-list';

const tagAdminComponent = function TagAdminComponent() {
  const session = useSessionContext();
  const tags = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (session.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (session.user?.role !== 'ADMIN') {
    return (
      <Page>
        <Panel>
          <h1>Теги</h1>
          <p className="muted">Теги доступны только админу.</p>
        </Panel>
      </Page>
    );
  }

  function edit(id: string) {
    const tag = tags.data?.find((item) => item.id === id);
    if (!tag) return;
    setEditingId(id);
    setName(tag.name);
    setError(null);
  }

  async function submit() {
    const next = name.trim();

    if (next.length < 2) {
      setError('Название тега должно быть не короче 2 символов');
      return;
    }

    setError(null);

    try {
      if (editingId) await updateTag.mutateAsync({ id: editingId, name: next });
      else await createTag.mutateAsync(next);

      setName('');
      setEditingId(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось сохранить тег');
    }
  }

  async function remove(id: string) {
    setError(null);

    try {
      await deleteTag.mutateAsync(id);
      if (editingId === id) {
        setEditingId(null);
        setName('');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось удалить тег');
    }
  }

  return (
    <Page>
      <div className={styles.layout}>
        <h1>Теги</h1>

        <Panel>
          <TagForm
            name={name}
            editing={editingId !== null}
            pending={createTag.isPending || updateTag.isPending}
            onName={setName}
            onSubmit={submit}
          />
          {error ? <p className="status">{error}</p> : null}
        </Panel>

        {tags.isLoading ? <p className="muted">Загрузка…</p> : null}
        {tags.data ? <TagList tags={tags.data} onEdit={edit} onDelete={(id) => void remove(id)} /> : null}
      </div>
    </Page>
  );
};
tagAdminComponent.displayName = 'TagAdmin';
/** Admin list and editor for tags. */
export const TagAdmin = memo(tagAdminComponent);

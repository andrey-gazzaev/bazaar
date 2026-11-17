'use client';

import { useState } from 'react';
import { useSessionContext } from '@/context';
import { useMyListings } from '@/hooks';
import type { NewProduct } from '@/models';
import { useCreateProduct, useDeleteProduct, useTags, useUpdateProduct } from '@/queries';
import { Button, Page, Panel } from '@/ui';
import type { ListingVm } from '@/view-models';
import { ListingFields } from './listing-fields';
import { ListingList } from './listing-list';
import styles from './listings.module.css';

/** A seller's own cards: add, edit, and delete. */
export function Listings() {
  const session = useSessionContext();
  const { listings, isLoading, error } = useMyListings();
  const tags = useTags();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const remove = useDeleteProduct();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ListingVm | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (session.user?.role !== 'SELLER') {
    return (
      <Page>
        <Panel>
          <h1>Мои объявления</h1>
          <p className="muted">Добавлять товары может продавец.</p>
        </Panel>
      </Page>
    );
  }

  if (isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить объявления';

    return <Page><p className="status">{message}</p></Page>;
  }

  async function onCreate(input: NewProduct) {
    await createProduct.mutateAsync(input);
    setCreating(false);
  }

  async function onEdit(input: NewProduct) {
    if (!editing) return;

    await updateProduct.mutateAsync({ id: editing.id, patch: input });
    setEditing(null);
  }

  async function onDelete(id: string) {
    setActionError(null);

    try {
      await remove.mutateAsync(id);

      if (editing?.id === id) setEditing(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Не удалось удалить товар');
    }
  }

  return (
    <Page>
      <div className={styles.stack}>
        <div className={styles.head}>
          <h1>Мои объявления</h1>

          <Button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            Добавить
          </Button>
        </div>

        {creating ? (
          <Panel>
            <h2>Новый товар</h2>

            <ListingFields
              tags={tags.data ?? []}
              pending={createProduct.isPending}
              requireImages
              submitLabel="Добавить товар"
              onSubmit={onCreate}
            />
          </Panel>
        ) : null}

        {editing ? (
          <Panel>
            <h2>Изменить товар</h2>

            <ListingFields
              key={editing.id}
              tags={tags.data ?? []}
              pending={updateProduct.isPending}
              requireImages={false}
              submitLabel="Сохранить"
              initial={editing}
              onSubmit={onEdit}
            />
          </Panel>
        ) : null}

        {actionError ? <p className="status">{actionError}</p> : null}

        <ListingList
          listings={listings}
          onEdit={(listing) => {
            setEditing(listing);
            setCreating(false);
          }}
          onDelete={(id) => void onDelete(id)}
        />
      </div>
    </Page>
  );
}

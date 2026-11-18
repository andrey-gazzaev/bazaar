'use client';

import { memo, useState } from 'react';
import { useModerationQueue } from '@/hooks';
import type { SessionUser } from '@/models';
import { useApproveProduct, useRejectProduct } from '@/queries';
import { Page, Panel } from '@/ui';
import { ModerationList } from './moderation-list';
import styles from './moderation.module.css';

/** Pending listings an admin can approve or reject. */
const ModerationComponent = function({
  user,
}: {
  /** Person from the user cookie. Null when nobody is signed in. */
  readonly user: SessionUser | null;
}) {
  const { items, isLoading, error } = useModerationQueue();
  const approve = useApproveProduct();
  const reject = useRejectProduct();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (user?.role !== 'ADMIN') {
    return (
      <Page>
        <Panel>
          <h1>Модерация</h1>
          <p className="muted">Очередь доступна администратору.</p>
        </Panel>
      </Page>
    );
  }

  if (isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить очередь';

    return <Page><p className="status">{message}</p></Page>;
  }

  async function review(id: string, action: (id: string) => Promise<unknown>) {
    setActionError(null);
    setPendingId(id);

    try {
      await action(id);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Не удалось сохранить решение');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Page>
      <div className={styles.stack}>
        <h1>Модерация</h1>

        {actionError ? <p className="status">{actionError}</p> : null}

        <ModerationList
          items={items}
          pendingId={pendingId}
          onApprove={(id) => void review(id, (productId) => approve.mutateAsync(productId))}
          onReject={(id) => void review(id, (productId) => reject.mutateAsync(productId))}
        />
      </div>
    </Page>
  );
}

ModerationComponent.displayName = 'Moderation';
export const Moderation = memo(ModerationComponent);

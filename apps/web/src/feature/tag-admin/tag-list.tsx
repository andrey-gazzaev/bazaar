import type { Tag } from '@/models';
import { Button } from '@/ui';
import styles from './tag-admin.module.css';

/** Tags an admin can rename or remove. */
export function TagList({
  tags,
  onEdit,
  onDelete,
}: {
  readonly tags: readonly Tag[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}) {
  if (tags.length === 0) return <p className="muted">Тегов пока нет.</p>;

  return (
    <div className={styles.list}>
      {tags.map((tag) => (
        <div className={styles.row} key={tag.id}>
          <span>{tag.name}</span>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => onEdit(tag.id)}>
              Изменить
            </Button>
            <Button variant="danger" onClick={() => onDelete(tag.id)}>
              Удалить
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

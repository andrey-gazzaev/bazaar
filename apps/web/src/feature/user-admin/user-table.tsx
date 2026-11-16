import type { UserRowVm } from '@/view-models';
import { Button } from '@/ui';
import styles from './user-admin.module.css';

/** Accounts an admin can change or remove. */
export function UserTable({
  rows,
  onEdit,
  onDelete,
}: {
  readonly rows: readonly UserRowVm[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.roleLabel}</td>
            <td>
              <div className={styles.actions}>
                <Button variant="ghost" onClick={() => onEdit(row.id)}>
                  Изменить
                </Button>
                <Button variant="danger" onClick={() => onDelete(row.id)}>
                  Удалить
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

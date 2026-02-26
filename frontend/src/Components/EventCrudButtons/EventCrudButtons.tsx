import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { deleteEvent } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { Link } from '../Link';
import styles from './EventCrudButtons.module.scss';

type EventCrudButtons = {
  title?: ReactNode;
  id?: string;
  icon_size?: number;
  is_staff?: boolean;
};

export function EventCrudButtons({ title = 'event', id, icon_size = 17, is_staff = false }: EventCrudButtons) {
  const { user } = useAuthContext();
  const isStaff = user?.is_staff || is_staff;
  const canChangeEvent = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id }) || is_staff;

  const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: id } });
  const detailUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_event_change,
    urlParams: { objectId: id },
  });

  return (
    <>
      {canChangeEvent && (
        <Link className={styles.default_edit} url={editUrl}>
          <Icon className={styles.edit_icon} icon="mdi:pencil" height={icon_size} />
        </Link>
      )}
      {canChangeEvent && (
        <button
          className={styles.delete_edit}
          onClick={() => {
            const con = window.confirm(`Are you sure you want to delete ${title}`);
            if (con && id) {
              deleteEvent(id)
                .then(() => {
                  alert(`Deleted ${title}`);
                })
                .catch(() => {
                  alert(`Failed to delete ${title}`);
                });
            }
          }}
          type="button"
        >
          <Icon className={styles.edit_icon} icon="mdi:trash-can-outline" height={icon_size} />
        </button>
      )}
      {isStaff && canChangeEvent && (
        <Link className={styles.detail_edit} url={detailUrl} target="backend">
          <Icon className={styles.edit_icon} icon="vscode-icons:file-type-django" height={icon_size} />
        </Link>
      )}
    </>
  );
}

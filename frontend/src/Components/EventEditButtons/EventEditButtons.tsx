import styles from './EventEditButtons.module.scss';
import { useAuthContext } from '~/context/AuthContext';
import { hasPerm } from '~/utils';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { Link } from '../Link';
import { Icon } from '@iconify/react';
import { deleteEvent } from '~/api';
import type { ReactNode } from 'react';

type EventEditButtons = {
  title?: ReactNode;
  id?: string;
  icon_size?: number;
};

/** Component for displaying a youtube video */
export function EventEditButtons({ title = "event", id, icon_size = 17 }: EventEditButtons) {
  const { user } = useAuthContext();
  const isStaff = user?.is_staff;
  const canChangeEvent = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id });

  const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: id } });
  const detailUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_event_change,
    urlParams: { objectId: id },
  });

  return (
    <>
      {canChangeEvent && (
        <Link className={styles.default_edit}
          url={editUrl}
        > 
          <Icon className={styles.edit_icon} icon="mdi:pencil" height={icon_size} />
        </Link>
      )}
      {canChangeEvent && (
        <button className={styles.delete_edit}
          onClick={() => {
            const con = window.confirm(`Are you sure you want to delete ${title}`)
            if (con && id) {
              deleteEvent(id)
                .then(() => {
                  alert(`Deleted ${title}`)
                })
                .catch(() => {
                  alert(`Failed to delete ${title}`)
                })
            }
          }}
          type="button"
        > 
          <Icon className={styles.edit_icon} icon="mdi:trash-can-outline" height={icon_size} /> 
        </button>
      )}
      {isStaff && canChangeEvent && (
        <Link className={styles.detail_edit}
          url={detailUrl}
          target="backend"
        > 
          <Icon className={styles.edit_icon} icon="vscode-icons:file-type-django" height={icon_size} />
        </Link>
      )}
    </>
  );
}

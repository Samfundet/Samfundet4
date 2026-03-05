import type { ReactNode } from 'react';
import { useAuthContext } from '~/context/AuthContext';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { CrudButtons } from '../CrudButtons';
import { useCustomNavigate } from '~/hooks';
import { deleteEvent } from '~/api';

type EventCrudButtons = {
  title?: ReactNode;
  id?: string;
  is_staff_overwrite?: boolean;
  have_view?: boolean;
  height?: string | number;
};

export function EventCrudButtons({
  title = 'event',
  id,
  is_staff_overwrite = false,
  have_view = true,
  height,
}: EventCrudButtons) {
  const { user } = useAuthContext();
  const nav = useCustomNavigate();
  const isStaff = user?.is_staff || is_staff_overwrite;
  const canChangeEvent =
    hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id }) || is_staff_overwrite;

  const viewUrl = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: id } });
  const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: id } });
  const djangoUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_event_change,
    urlParams: { objectId: id },
  });

  return (
    <CrudButtons
      onView={have_view ? () => nav({ url: viewUrl }) : undefined}
      onEdit={canChangeEvent || isStaff ? () => nav({ url: editUrl }) : undefined}
      onDelete={
        canChangeEvent || isStaff
          ? () => {
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
          }
          : undefined
      }
      onManage={isStaff ? () => nav({ linkTarget: 'backend', url: djangoUrl }) : undefined}
      height={height}
    />
  );
}

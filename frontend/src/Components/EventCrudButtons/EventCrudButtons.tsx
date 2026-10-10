import { t } from 'i18next';
import { useAuthContext } from '~/context/AuthContext';
import { useDeleteEvent } from '~/domain';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { CrudButtons } from '../CrudButtons';

type EventCrudButtons = {
  id?: string | number;
  removeView?: boolean;
  height?: string | number;
  deleteRedirect?: boolean;
};

export function EventCrudButtons({ id, removeView = false, height, deleteRedirect = false }: EventCrudButtons) {
  const { user } = useAuthContext();
  const nav = useCustomNavigate();
  const isStaff = user?.is_staff;
  const canChangeEvent = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id });

  const viewUrl = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: id } });
  const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: id } });
  const djangoUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_event_change,
    urlParams: { objectId: id },
  });

  const deleteMutation = useDeleteEvent();

  return (
    <CrudButtons
      onView={!removeView ? () => nav({ url: viewUrl }) : undefined}
      onEdit={canChangeEvent || isStaff ? () => nav({ url: editUrl }) : undefined}
      onDelete={
        canChangeEvent || isStaff
          ? () => {
              const con = window.confirm(t(KEY.common_ask_delete));
              if (con && id) {
                deleteMutation.mutate(id, { onSuccess: () => deleteRedirect && nav({ url: -1 }) });
              }
            }
          : undefined
      }
      onManage={isStaff ? () => nav({ linkTarget: 'backend', url: djangoUrl }) : undefined}
      height={height}
    />
  );
}

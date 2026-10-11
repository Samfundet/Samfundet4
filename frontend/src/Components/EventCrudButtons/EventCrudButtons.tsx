import { useTranslation } from 'react-i18next';
import { useAuthContext } from '~/context/AuthContext';
import { type EventId, useDeleteEvent } from '~/domain';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { CrudButtons } from '../CrudButtons';
import type { IconButtonSize } from '../IconButton';

type EventCrudButtonsProps = {
  id?: EventId;
  removeView?: boolean;
  size?: IconButtonSize;
  deleteRedirect?: boolean;
};

export function EventCrudButtons({ id, removeView = false, size, deleteRedirect = false }: EventCrudButtonsProps) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const nav = useCustomNavigate();
  const { mutate: deleteEvent } = useDeleteEvent();

  const isStaff = user?.is_staff;
  const canEdit = isStaff || hasPerm({ user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id });

  const viewUrl = reverse({ pattern: ROUTES.frontend.event, urlParams: { id } });
  const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id } });
  const djangoUrl = reverse({ pattern: ROUTES.backend.admin__samfundet_event_change, urlParams: { objectId: id } });

  function handleDelete() {
    if (id && window.confirm(t(KEY.common_ask_delete))) {
      deleteEvent(id, { onSuccess: () => deleteRedirect && nav({ url: -1 }) });
    }
  }

  return (
    <CrudButtons
      onView={!removeView && (() => nav({ url: viewUrl }))}
      onEdit={canEdit && (() => nav({ url: editUrl }))}
      onManage={isStaff && (() => nav({ linkTarget: 'backend', url: djangoUrl }))}
      onDelete={canEdit && handleDelete}
      size={size}
    />
  );
}

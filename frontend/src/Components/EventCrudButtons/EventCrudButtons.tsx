import { useTranslation } from 'react-i18next';
import { useAuthContext } from '~/context/AuthContext';
import { type ID, useDeleteEvent } from '~/domain';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { CrudButtons } from '../CrudButtons';
import type { IconButtonSize } from '../IconButton';

type EventCrudButtonsProps = {
  id: ID;
  size?: IconButtonSize;
  deleteRedirect?: string | number;

  removeView?: boolean;
  removeManage?: boolean;
  removeEdit?: boolean;
  removeDelete?: boolean;
  removeCopy?: boolean;
};

export function EventCrudButtons({ id, size, deleteRedirect, ...removals }: EventCrudButtonsProps) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const nav = useCustomNavigate();
  const { mutate: deleteEvent } = useDeleteEvent();

  const isSuper = user?.is_superuser;
  const canView = isSuper || hasPerm({ user, permission: PERM.SAMFUNDET_VIEW_EVENT, obj: id });
  const canEdit = isSuper || hasPerm({ user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id });
  const canDelete = isSuper || hasPerm({ user, permission: PERM.SAMFUNDET_DELETE_EVENT, obj: id });
  const canManage = isSuper;

  const viewUrl = reverse({
    pattern: ROUTES.frontend.event,
    urlParams: { id },
  });

  const editUrl = reverse({
    pattern: ROUTES.frontend.admin_events_edit,
    urlParams: { id },
  });

  const djangoUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_event_change,
    urlParams: { objectId: id },
  });

  const copyUrl = reverse({
    pattern: ROUTES.frontend.admin_events_create,
    queryParams: { template: id },
  });

  function handleDelete() {
    if (id && window.confirm(t(KEY.event_confirm_delete))) {
      deleteEvent(id, { onSuccess: () => deleteRedirect !== undefined && nav({ url: deleteRedirect }) });
    }
  }

  return (
    <CrudButtons
      onView={!removals.removeView && canView && (() => nav({ url: viewUrl }))}
      onEdit={!removals.removeEdit && canEdit && (() => nav({ url: editUrl }))}
      onCopy={!removals.removeCopy && canEdit && (() => nav({ url: copyUrl }))}
      onManage={!removals.removeManage && canManage && (() => nav({ linkTarget: 'backend', url: djangoUrl }))}
      onDelete={!removals.removeDelete && canDelete && handleDelete}
      size={size}
    />
  );
}

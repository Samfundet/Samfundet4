import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { deleteEvent } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPerm } from '~/utils';
import { CrudButtons } from '../CrudButtons';

type EventCrudButtons = {
  title?: ReactNode;
  id?: string;
  have_view?: boolean;
  height?: string | number;
};

export function EventCrudButtons({ title = 'event', id, have_view = true, height }: EventCrudButtons) {
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

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  return (
    <CrudButtons
      onView={have_view ? () => nav({ url: viewUrl }) : undefined}
      onEdit={canChangeEvent || isStaff ? () => nav({ url: editUrl }) : undefined}
      onDelete={
        canChangeEvent || isStaff
          ? () => {
              const con = window.confirm(`${t(KEY.common_ask_delete)} ${title}`);
              if (con && id) {
                deleteMutation.mutate(id);
              }
            }
          : undefined
      }
      onManage={isStaff ? () => nav({ linkTarget: 'backend', url: djangoUrl }) : undefined}
      height={height}
    />
  );
}

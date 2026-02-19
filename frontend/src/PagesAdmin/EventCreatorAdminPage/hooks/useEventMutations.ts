import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { postEvent, putEvent } from '~/api';
import type { EventDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';

type UpdateEventInput = {
  id: number | string;
  payload: Partial<EventDto>;
};

export function useEventMutations() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const createEventMutation = useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      navigate({ url: ROUTES.frontend.admin_events });
      toast.success(t(KEY.common_creation_successful));
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const editEventMutation = useMutation({
    mutationFn: (data: UpdateEventInput) => putEvent(data.id, data.payload),
    onSuccess: () => {
      navigate({ url: ROUTES.frontend.admin_events });
      toast.success(t(KEY.common_save_successful));
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  return {
    createEventMutation,
    editEventMutation,
  };
}

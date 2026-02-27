import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { type FormType, SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getClosedPeriod, postClosedPeriod, putClosedPeriod } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodFormAdminPage.module.scss';

type formType = {
  message_nb: string;
  message_en: string;
  start_dt: string;
  end_dt: string;
};

export function ClosedPeriodFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const min_length_message = 10;

  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['closed-period', id],
    queryFn: () => getClosedPeriod(id as string),
    enabled: !!id,
    select: (data) => ({
      message_nb: data.message_nb,
      message_en: data.message_en,
      start_dt: data.start_dt,
      end_dt: data.end_dt,
    }),
  });

  useEffect(() => {
    if (isError) {
      navigate({ url: ROUTES.frontend.admin_closed, replace: true });
      toast.error(t(KEY.common_something_went_wrong));
    }
  }, [isError, t, navigate]);

  const updateMutation = useMutation({
    mutationFn: (data: FormType) => putClosedPeriod(id as string, data),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      navigate({ url: reverse({ pattern: ROUTES.frontend.admin_closed }) });
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: formType) => postClosedPeriod(data),
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      navigate({ url: reverse({ pattern: ROUTES.frontend.admin_closed }) });
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  function handleOnSubmit(data: formType) {
    if (id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  const labelMessage = `${t(KEY.common_message)} under '${t(KEY.common_opening_hours)}'`;
  const title = id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={isLoading} header={true}>
      <SamfForm<formType> onSubmit={handleOnSubmit} initialData={initialData}>
        <div className={styles.row}>
          <SamfFormField
            validator={(state: formType) => state.message_nb.length > min_length_message}
            field="message_nb"
            required={true}
            type="text_long"
            label={`${labelMessage} (${t(KEY.common_norwegian)})`}
          />
          <SamfFormField
            validator={(state: formType) => state.message_en.length > min_length_message}
            field="message_en"
            required={true}
            type="text_long"
            label={`${labelMessage} (${t(KEY.common_english)})`}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            validator={(state: formType) => (state.end_dt ? new Date(state.start_dt) <= new Date(state.end_dt) : true)}
            field="start_dt"
            type="date"
            label={`${t(KEY.start_time)}`}
          />
          <SamfFormField
            validator={(state: formType) =>
              state.start_dt ? new Date(state.start_dt) <= new Date(state.end_dt) : true
            }
            field="end_dt"
            type="date"
            label={`${t(KEY.end_time)}`}
          />
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}

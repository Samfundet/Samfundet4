import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getClosedPeriod, postClosedPeriod, putClosedPeriod } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
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

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  // const [closedPeriod, setClosedPeriod] = useState<ClosedPeriodDto | undefined>(undefined); For posting
  const [initialData, setInitialData] = useState<formType | undefined>(undefined);

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  const min_length_message = 10;

  // Stuff to do on first render.
  // TODO add permissions on render
  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    // TODO add fix on no id on editpage
    if (id === undefined) {
      setShowSpinner(false);
      return;
    }

    getClosedPeriod(id)
      .then((data) => {
        setInitialData({
          message_nb: data.message_nb,
          message_en: data.message_en,
          start_dt: data.start_dt,
          end_dt: data.end_dt,
        });
        setShowSpinner(false);
      })
      .catch((data: AxiosError) => {
        if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
          navigate({ url: ROUTES.frontend.admin_closed, replace: true });
        }
        toast.error(t(KEY.common_something_went_wrong));
        console.error(data);
      });
  }, [id]);

  function handleOnSubmit(data: formType) {
    if (id !== undefined) {
      putClosedPeriod(id, data)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate({ url: reverse({ pattern: ROUTES.frontend.admin_closed }) });
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      postClosedPeriod(data)
        .then(() => {
          toast.success(t(KEY.common_creation_successful));
          navigate({ url: reverse({ pattern: ROUTES.frontend.admin_closed }) });
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }

  const labelMessage = `${t(KEY.common_message)} under '${t(KEY.common_opening_hours)}'`;
  const title = id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={showSpinner} header={true}>
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

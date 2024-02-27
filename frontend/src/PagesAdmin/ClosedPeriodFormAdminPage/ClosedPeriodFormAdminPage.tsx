import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm, SamfFormModel } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getClosedPeriod } from '~/api';
import { ClosedPeriodDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodFormAdminPage.module.scss';

const isValidDateRange = (values: SamfFormModel) =>
  values['start_dt'] != undefined && values['end_dt'] != undefined && values['start_dt'] < values['end_dt'];

export function ClosedPeriodFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [closedPeriod, setClosedPeriod] = useState<ClosedPeriodDto | undefined>(undefined);

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    // TODO add fix on no id on editpage
    if (id === undefined) {
      setShowSpinner(false);
      return;
    }

    getClosedPeriod(id)
      .then((data) => {
        setClosedPeriod(data);
        setShowSpinner(false);
      })
      .catch((data: AxiosError) => {
        // TODO add error pop up message?
        if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
          navigate({ url: ROUTES.frontend.admin_gangs });
        }
        toast.error(t(KEY.common_something_went_wrong));
        console.error(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleOnSubmit(data: ClosedPeriodDto) {
    if (id !== undefined) {
      // TODO patch data
    } else {
      // TODO post data
    }
    alert('TODO Submit');
    console.log(JSON.stringify(data));
  }

  const labelMessage = `${t(KEY.common_message)} under '${t(KEY.common_opening_hours)}'`;
  const labelDescription = `${t(KEY.common_description)} under '${t(KEY.common_whatsup)}'`;
  const title = id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period);

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm onSubmit={handleOnSubmit} initialData={closedPeriod}>
        <div className={styles.row}>
          <SamfFormField
            field="message_no"
            type="text-long"
            label={`${labelMessage} (${t(KEY.common_norwegian)})`}
          ></SamfFormField>
          <SamfFormField
            field="message_en"
            type="text-long"
            label={`${labelMessage} (${t(KEY.common_english)})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="description_no"
            type="text-long"
            label={`${labelDescription} (${t(KEY.common_norwegian)})`}
          ></SamfFormField>
          <SamfFormField
            field="description_en"
            type="text-long"
            label={`${labelDescription} (${t(KEY.common_english)})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="start_dt"
            type="date"
            label={`${t(KEY.start_time)}`}
            validator={isValidDateRange}
          ></SamfFormField>
          <SamfFormField
            field="end_dt"
            type="date"
            label={`${t(KEY.end_time)}`}
            validator={isValidDateRange}
          ></SamfFormField>
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getClosedPeriod } from '~/api';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodFormAdminPage.module.scss';

type formType = {
  message_no: string;
  message_en: string;
  description_no: string;
  description_en: string;
  start_dt: Date;
  end_dt: Date;
};

export function ClosedPeriodFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  // const [closedPeriod, setClosedPeriod] = useState<ClosedPeriodDto | undefined>(undefined); For posting
  const [initialData, setInitialData] = useState<formType | undefined>(undefined);

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
        // setClosedPeriod(data); For posting
        setInitialData({
          message_no: data.message_no,
          message_en: data.message_en,
          description_no: data.description_no,
          description_en: data.description_en,
          start_dt: new Date(data.start_dt),
          end_dt: new Date(data.end_dt),
        });
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

  function handleOnSubmit(data: formType) {
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
      <SamfForm onSubmit={handleOnSubmit} initialData={initialData}>
        <div className={styles.row}>
          <SamfFormField
            field="message_no"
            type="textLong"
            label={`${labelMessage} (${t(KEY.common_norwegian)})`}
          ></SamfFormField>
          <SamfFormField
            field="message_en"
            type="textLong"
            label={`${labelMessage} (${t(KEY.common_english)})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="description_no"
            type="textLong"
            label={`${labelDescription} (${t(KEY.common_norwegian)})`}
          ></SamfFormField>
          <SamfFormField
            field="description_en"
            type="textLong"
            label={`${labelDescription} (${t(KEY.common_english)})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField field="start_dt" type="dateTime" label={`${t(KEY.start_time)}`}></SamfFormField>
          <SamfFormField field="end_dt" type="dateTime" label={`${t(KEY.end_time)}`}></SamfFormField>
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}

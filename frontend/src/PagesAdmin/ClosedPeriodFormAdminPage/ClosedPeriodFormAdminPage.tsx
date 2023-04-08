import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getClosedPeriod } from '~/api';
import { ClosedPeriodDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ClosedPeriodFormAdminPage.module.scss';

export function ClosedPeriodFormAdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [closedPeriod, setClosedPeriod] = useState<ClosedPeriodDto | undefined>(undefined);

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // TODO add fix on no id on editpage
    if (id) {
      getClosedPeriod(id)
        .then((data) => {
          setClosedPeriod(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_gangs);
          }
        });
    } else {
      setShowSpinner(false);
    }
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

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const labelMessage = `${t(KEY.common_message)} under '${t(KEY.common_opening_hours)}'`;
  const labelDescription = `${t(KEY.common_description)} under '${t(KEY.common_whatsup)}' (${t(KEY.common_norwegian)})`;

  return (
    <Page>
      <h1 className={styles.header}>
        {id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period)}
      </h1>
      <SamfForm onSubmit={handleOnSubmit} initialData={closedPeriod}>
        <div className={styles.row}>
          <SamfFormField
            field="message_no"
            type="text-long"
            label={`${labelMessage} (${KEY.common_norwegian})`}
          ></SamfFormField>
          <SamfFormField
            field="message_en"
            type="text-long"
            label={`${labelMessage} (${KEY.common_english})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="description_no"
            type="text-long"
            label={`${labelDescription} (${KEY.common_norwegian})`}
          ></SamfFormField>
          <SamfFormField
            field="description_en"
            type="text-long"
            label={`${labelDescription} (${KEY.common_english})`}
          ></SamfFormField>
        </div>
        <div className={styles.row}>
          <SamfFormField field="start_dt" type="datetime" label={`${t(KEY.start_time)}`}></SamfFormField>
          <SamfFormField field="end_dt" type="datetime" label={`${t(KEY.end_time)}`}></SamfFormField>
        </div>
      </SamfForm>
    </Page>
  );
}

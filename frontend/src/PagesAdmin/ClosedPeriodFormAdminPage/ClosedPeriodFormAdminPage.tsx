import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getClosedPeriod } from '~/api';
import { Button, FormInputField, FormTextAreaField, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { DTOToForm } from '~/utils';
import styles from './ClosedPeriodFormAdminPage.module.scss';

export function ClosedPeriodFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const {
    register,
    // handleSubmit,
    // setError,
    setValue,
    formState: { errors },
  } = useForm();
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
          DTOToForm(data, setValue, []);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_gangs);
          }
        });
    }
    setShowSpinner(false);
  }, [id]);

  // function onSubmit(data: ClosedPeriodDto) {
  //   (id ? putClosedPeriod(id, data) : postClosedPeriod(data))
  //     .then(() => {
  //       navigate(ROUTES.frontend.admin_closed);
  //     })
  //     .catch((e) => {
  //       for (const err in e.response.data) {
  //         setError(err, { type: 'custom', message: e.response.data[err][0] });
  //       }
  //     });
  // }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_closed)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period)}
      </h1>
      {/* TODO: fix */}
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <form>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              name="message_no"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {`${t(KEY.common_message)} under '${t(KEY.opening_hours)}' (${t(KEY.norwegian)})`}
              </p>
            </FormTextAreaField>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              name="description_no"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {`${t(KEY.common_description)} under '${t(KEY.common_whatsup)}' (${t(KEY.norwegian)})`}
              </p>
            </FormTextAreaField>
          </div>
          <div className={styles.col}>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              name="message_en"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {`${t(KEY.common_message)} under '${t(KEY.opening_hours)}' (${t(KEY.english)})`}
              </p>
            </FormTextAreaField>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              name="description_en"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {`${t(KEY.common_description)} under '${t(KEY.common_whatsup)}' (${t(KEY.english)})`}
              </p>
            </FormTextAreaField>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormInputField
              type="date"
              errors={errors}
              className={styles.input}
              name="start_dt"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>{t(KEY.start_time)}</p>
            </FormInputField>
          </div>
          <div className={styles.col}>
            <FormInputField
              type="date"
              errors={errors}
              className={styles.input}
              name="end_dt"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>{t(KEY.end_time)}</p>
            </FormInputField>
          </div>
        </div>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.closed_period)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

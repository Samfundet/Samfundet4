import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner, Select } from '~/Components';

import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './EventFormAdminPage.module.scss';
import ReactMarkdown from 'react-markdown';
import { postEvent } from '~/api';
import { STATUS } from '~/http_status_codes';
import { reverse } from '~/named-urls';
import { useForm } from 'react-hook-form';
import { FormInputField } from '~/Components/InputField';
import { FormTextAreaField } from '~/Components/TextAreaField';
export function EventFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = (data) => {
    console.log(data);
    postEvent(data)
      .then((status) => {
        console.log(status);
        navigate(ROUTES.frontend.admin_events_upcomming);
      })
      .catch((e) => {
        console.log(e.response.data);
        for (const err in e.response.data) {
          setError(err, { type: 'custom', message: e.response.data[err][0] });
        }
      });
  };

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_gangs)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.common_event)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormInputField errors={errors} className={styles.input} name="title_no" register={register}>
              <p className={styles.labelText}>
                {t(KEY.norwegian)} {t(KEY.common_title)}
              </p>
            </FormInputField>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              rows={2}
              name="description_short_no"
              register={register}
            >
              <p className={styles.labelText}>
                {t(KEY.common_short)} {t(KEY.common_description)} ({t(KEY.norwegian)})
              </p>
            </FormTextAreaField>
            <FormTextAreaField errors={errors} className={styles.input} name="description_long_no" register={register}>
              <p className={styles.labelText}>
                {t(KEY.common_long)} {t(KEY.common_description)} ({t(KEY.norwegian)})
              </p>
            </FormTextAreaField>
          </div>
          <div className={styles.col}>
            <FormInputField errors={errors} className={styles.input} name="title_en" register={register}>
              <p className={styles.labelText}>
                {t(KEY.common_title)} ({t(KEY.english)})
              </p>
            </FormInputField>
            <FormTextAreaField
              errors={errors}
              className={styles.input}
              rows={2}
              name="description_short_en"
              register={register}
            >
              <p className={styles.labelText}>
                {t(KEY.common_short)} {t(KEY.common_description)} ({t(KEY.norwegian)})
              </p>
            </FormTextAreaField>
            <FormTextAreaField errors={errors} className={styles.input} name="description_long_en" register={register}>
              <p className={styles.labelText}>
                {t(KEY.common_long)} {t(KEY.common_description)} ({t(KEY.norwegian)})
              </p>
            </FormTextAreaField>
          </div>
        </div>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.common_event)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

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
import { getEventForm, getEventGroups, getVenues, postEvent } from '~/api';
import { STATUS } from '~/http_status_codes';
import { reverse } from '~/named-urls';
import { useForm } from 'react-hook-form';
import { FormInputField } from '~/Components/InputField';
import { FormTextAreaField } from '~/Components/TextAreaField';
import { FormSelect } from '~/Components/Select/FormSelect';
export function EventFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [formChoices, setFormChoices] = useState<Object>([]);
  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    getEventForm()
      .then((data) => {
        console.log(data);
        setFormChoices(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

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

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_gangs)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.common_event)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.seperator}>Info</div>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormInputField
              errors={errors}
              className={styles.input}
              name="title_no"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {t(KEY.norwegian)} {t(KEY.common_title)} *
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
            <FormInputField
              errors={errors}
              className={styles.input}
              name="title_en"
              required={t(KEY.form_required)}
              register={register}
            >
              <p className={styles.labelText}>
                {t(KEY.common_title)} ({t(KEY.english)}) *
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
        <div className={styles.row}>
          <FormSelect
            register={register}
            options={formChoices?.event_groups}
            selectClassName={styles.select}
            className={styles.col}
            required={t(KEY.form_must_choose)}
            errors={errors}
            name="event_group"
          >
            <p className={styles.labelText}>{t(KEY.event_type)}</p>
          </FormSelect>
          <FormSelect
            register={register}
            options={formChoices?.age_groups}
            selectClassName={styles.select}
            className={styles.col}
            required={t(KEY.form_must_choose)}
            errors={errors}
            name="age_group"
          >
            <p className={styles.labelText}>{t(KEY.common_age_res)}</p>
          </FormSelect>

          <FormSelect
            register={register}
            options={formChoices?.venues}
            selectClassName={styles.select}
            className={styles.col}
            errors={errors}
            required={t(KEY.form_must_choose)}
            name="location"
          >
            <p className={styles.labelText}>{t(KEY.venue)}</p>
          </FormSelect>
          <FormSelect
            register={register}
            options={formChoices?.status_groups}
            selectClassName={styles.select}
            className={styles.col}
            errors={errors}
            required={t(KEY.form_must_choose)}
            name="status_group"
          >
            <p className={styles.labelText}>Status</p>
          </FormSelect>
        </div>
        <div className={styles.col}>
          <FormInputField errors={errors} className={styles.input} name="codeword" register={register}>
            <p className={styles.labelText}>Codeword</p>
          </FormInputField>
        </div>
        <div className={styles.seperator}>Tidspunkt</div>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormInputField
              type="datetime-local"
              errors={errors}
              className={styles.input}
              name="start_dt"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>{t(KEY.start_time)} *</p>
            </FormInputField>
          </div>
          <div className={styles.col}>
            <FormInputField
              type="datetime-local"
              errors={errors}
              className={styles.input}
              name="start_dt"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>
                {t(KEY.publication)} {t(KEY.common_time)} *
              </p>
            </FormInputField>
          </div>
          <div className={styles.col}>
            <FormInputField
              type="number"
              errors={errors}
              className={styles.input}
              name="duration"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>{t(KEY.duration)} (min)*</p>
            </FormInputField>
          </div>
        </div>
        <div className={styles.seperator}>Bilde</div>
        <div className={styles.col}>
          
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

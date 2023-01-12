import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormInputField, FormSelect, SamfundetLogoSpinner } from '~/Components';

import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Page } from '~/Components/Page';
import { getEvent, getSaksdokumentForm, postSaksdokument, putEvent } from '~/api';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { DTOToForm } from '~/utils';
import styles from './SaksdokumentFormAdminPage.module.scss';

export function SaksdokumentFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [formChoices, setFormChoices] = useState<Record<string, unknown>>([]);
  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getSaksdokumentForm()
      .then((data) => {
        setFormChoices(data);
        setShowSpinner(false);
      })
      .catch(console.error);
    if (id) {
      getEvent(id)
        .then((data) => {
          DTOToForm(data, setValue, ['end_dt']);
        })
        .catch((data) => {
          console.log(data);
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin);
          }
        });
    }
  }, [id]);

  const onSubmit = (data) => {
    (id ? putEvent(id, data) : postSaksdokument(data))
      .then(() => {
        navigate(ROUTES.frontend.admin);
      })
      .catch((e) => {
        console.error(e.response.data);
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
  {
    console.log(formChoices ? formChoices : 'nope');
  }
  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.saksdokument)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <div className={styles.col}>
            <FormInputField
              errors={errors}
              className={styles.input}
              name="title_no"
              register={register}
              required={true}
            >
              <p className={styles.labelText}>
                {t(KEY.norwegian)} {t(KEY.common_title)} *
              </p>
            </FormInputField>
          </div>
          <div className={styles.col}>
            <FormInputField
              errors={errors}
              className={styles.input}
              name="title_en"
              required={true}
              register={register}
            >
              <p className={styles.labelText}>
                {t(KEY.common_title)} ({t(KEY.english)}) *
              </p>
            </FormInputField>
          </div>
        </div>
        <div className={styles.row}>
          <FormInputField
            type="datetime-local"
            errors={errors}
            className={classNames(styles.input, styles.col)}
            name="publication_date"
            register={register}
            required={true}
          >
            <p className={styles.labelText}>{t(KEY.common_publication_date)} *</p>
          </FormInputField>
          <FormSelect
            register={register}
            options={formChoices?.categories}
            selectClassName={styles.select}
            className={styles.col}
            errors={errors}
            required={true}
            name="category"
          >
            <p className={styles.labelText}>Status</p>
          </FormSelect>
        </div>
        <div className={styles.row}>
          {/*
          TODO: Add support for uploading files, not currently implemented
          <FormInputField
            type="file"
            errors={errors}
            className={classNames(styles.input, styles.col)}
            name="file"
            register={register}
            required={false}
          >
            <p className={styles.labelText}>Document file *</p>
          </FormInputField> */}
        </div>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.saksdokument)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

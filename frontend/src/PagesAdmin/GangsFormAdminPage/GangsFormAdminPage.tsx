import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner, FormSelect, FormInputField } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './GangsFormAdminPage.module.scss';
import { getGang, getGangForm, postGang, putGang } from '~/api';
import { STATUS } from '~/http_status_codes';
import { useForm } from 'react-hook-form';
import { DTOToForm } from '~/utils';

export function GangsFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();
  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [formChoices, setFormChoices] = useState<Record<string, unknown>>([]);

  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // TODO add fix on no id on editpage
    getGangForm()
      .then((data) => {
        setFormChoices(data);
        setShowSpinner(false);
      })
      .catch(console.error);
    if (id) {
      getGang(id)
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

  const onSubmit = (data) => {
    (id ? putGang(id, data) : postGang(data))
      .then(() => {
        navigate(ROUTES.frontend.admin_gangs);
      })
      .catch((e) => {
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
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.gang)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          errors={errors}
          className={styles.input}
          name="name_no"
          required={t(KEY.form_required)}
          register={register}
        >
          <p className={styles.labelText}>
            {t(KEY.norwegian)} {t(KEY.name)}
          </p>
        </FormInputField>
        <FormInputField
          errors={errors}
          className={styles.input}
          name="name_en"
          required={t(KEY.form_required)}
          register={register}
        >
          <p className={styles.labelText}>
            {t(KEY.english)} {t(KEY.name)}
          </p>
        </FormInputField>
        <FormInputField
          errors={errors}
          className={styles.input}
          name="abbreviation"
          required={t(KEY.form_required)}
          register={register}
        >
          <p className={styles.labelText}>{t(KEY.abbreviation)}</p>
        </FormInputField>
        <FormInputField errors={errors} className={styles.input} name="webpage" register={register}>
          <p className={styles.labelText}>{t(KEY.webpage)}</p>
        </FormInputField>
        <FormSelect
          register={register}
          options={formChoices?.gang_type}
          selectClassName={styles.select}
          className={styles.col}
          errors={errors}
          name="gang_type"
          required={t(KEY.form_must_choose)}
        >
          <p className={styles.labelText}>{t(KEY.gang_type)}</p>
        </FormSelect>
        <FormSelect
          register={register}
          options={formChoices?.info_page}
          selectClassName={styles.select}
          className={styles.col}
          errors={errors}
          name="info_page"
          required={t(KEY.form_must_choose)}
        >
          <p className={styles.labelText}>{t(KEY.information_page)}</p>
        </FormSelect>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.gang)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

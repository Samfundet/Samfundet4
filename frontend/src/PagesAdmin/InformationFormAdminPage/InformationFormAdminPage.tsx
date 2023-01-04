import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner, FormInputField, FormTextAreaField } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationFormAdminPage.module.scss';
import ReactMarkdown from 'react-markdown';
import { getInformationPage, postInformationPage, putInformationPage } from '~/api';
import { STATUS } from '~/http_status_codes';
import { reverse } from '~/named-urls';
import { useForm } from 'react-hook-form';
import { DTOToForm } from '~/utils';

export function InformationFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // If form has a slugfield, check if it exists, and then load that item.
  const { slugField } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // TODO add fix on no slugfield on editpage
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          DTOToForm(data, setValue, []);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_information);
          }
        });
    }
    setShowSpinner(false);
  }, [slugField]);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const onSubmit = (data) => {
    (slugField ? putInformationPage(slugField, data) : postInformationPage(data))
      .then(() => {
        navigate(
          reverse({
            pattern: ROUTES.frontend.information_page_detail,
            urlParams: { slugField: slugField ? slugField : data.slug_field },
          }),
        );
      })
      .catch((e) => {
        for (const err in e.response.data) {
          setError(err, { type: 'custom', message: e.response.data[err][0] });
        }
      });
  };

  return (
    <Page>
      <Button
        theme="outlined"
        onClick={() => navigate(ROUTES.frontend.admin_information)}
        className={styles.backButton}
      >
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {slugField ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.information_page_short)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!slugField && (
          <div className={styles.inputGroup}>
            <FormInputField
              errors={errors}
              className={styles.input}
              name="slug_field"
              register={register}
              required={t(KEY.form_required)}
            >
              <p className={styles.labelText}>{t(KEY.name)}</p>
            </FormInputField>
          </div>
        )}
        <div className={styles.inputGroup}>
          <h2 className={styles.inputGroupHeader}>{t(KEY.norwegian)}</h2>
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
                  {t(KEY.norwegian)} {t(KEY.common_title)}
                </p>
              </FormInputField>
              <FormTextAreaField errors={errors} className={styles.input} rows={10} name="text_no" register={register}>
                <p className={styles.labelText}>
                  {t(KEY.norwegian)} {t(KEY.content)}
                </p>
              </FormTextAreaField>
            </div>
            <div className={styles.col}>
              <div className={styles.markdownField}>
                <ReactMarkdown>{getValues('text_no')}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <h2 className={styles.inputGroupHeader}>{t(KEY.english)}</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <FormInputField
                errors={errors}
                className={styles.input}
                name="title_en"
                register={register}
                required={t(KEY.form_required)}
              >
                <p className={styles.labelText}>
                  {t(KEY.english)} {t(KEY.common_title)}
                </p>
              </FormInputField>
              <FormTextAreaField errors={errors} className={styles.input} rows={10} name="text_en" register={register}>
                <p className={styles.labelText}>
                  {t(KEY.english)} {t(KEY.content)}
                </p>
              </FormTextAreaField>
            </div>
            <div className={styles.col}>
              <div className={styles.markdownField}>
                <ReactMarkdown>{getValues('text_en')}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {slugField ? t(KEY.admin_information_update_page) : t(KEY.admin_information_create_page)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

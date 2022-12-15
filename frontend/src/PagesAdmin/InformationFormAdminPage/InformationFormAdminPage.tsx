import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, InputField, SamfundetLogoSpinner, TextAreaField } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationFormAdminPage.module.scss';
import ReactMarkdown from 'react-markdown';
import { getInformationPage, postInformationPage, putInformationPage } from '~/api';
import { STATUS } from '~/http_status_codes';

export function InformationFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const [name, setName] = useState({ value: '', error: '' });
  const [titleNo, setTitleNo] = useState({ value: '', error: '' });
  const [textNo, setTextNo] = useState({ value: '', error: '' });
  const [titleEn, setTitleEn] = useState({ value: '', error: '' });
  const [textEn, setTextEn] = useState({ value: '', error: '' });

  // If form has a slugfield, check if it exists, and then load that item.
  const { slugField } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    // TODO add fix on no slugfield on editpage
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setName({ value: data.slug_field, error: '' });
          setTitleNo({ value: data.title_no, error: '' });
          setTitleEn({ value: data.title_en, error: '' });
          setTextEn({ value: data.text_en, error: '' });
          setTextNo({ value: data.text_no, error: '' });
        })
        .catch((data) => {
          console.log(data);
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_information);
          }
        });
    }
    setShowSpinner(false);
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function post(event: SyntheticEvent) {
    event.preventDefault();
    const data = {
      title_no: titleNo.value,
      title_en: titleEn.value,
      text_no: textNo.value,
      text_en: textEn.value,
    };
    if (slugField) {
      data.slug_field = slugField;
      putInformationPage(data)
        .then((status) => {
          console.log(status);
          navigate(ROUTES.frontend.information_page_list + slugField);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      data.slug_field = name.value;
      postInformationPage(data)
        .then((status) => {
          console.log(status);
          navigate(ROUTES.frontend.information_page_list + data.slug_field);
        })
        .catch((e) => {
          console.log(e.response.data);
          if ('slug_field' in e.response.data) {
            setName({ value: name.value, error: e.response.data.slug_field });
          }
          if ('title_no' in e.response.data) {
            setTitleNo({ value: titleNo.value, error: e.response.data.title_no });
          }
          if ('title_en' in e.response.data) {
            setTitleEn({ value: titleEn.value, error: e.response.data.title_en });
          }
          if ('text_en' in e.response.data) {
            setTextEn({ value: textEn.value, error: e.response.data.text_en });
          }
          if ('text_no' in e.response.data) {
            setTextNo({ value: textNo.value, error: e.response.data.text_no });
          }
        });
    }
  }

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
        {slugField ? t(KEY.admin_information_edit_page) : t(KEY.admin_information_new_page)}
      </h1>
      <form onSubmit={post}>
        {!slugField && (
          <div className={styles.inputGroup}>
            <InputField
              className={styles.input}
              value={name.value}
              error={name.error}
              onChange={(e) => setName({ value: e ? e.currentTarget.value : '', error: '' })}
            >
              <p className={styles.labelText}>{t(KEY.name)}</p>
            </InputField>
          </div>
        )}
        <div className={styles.inputGroup}>
          <h2 className={styles.inputGroupHeader}>{t(KEY.norwegian)}</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <InputField
                className={styles.input}
                value={titleNo.value}
                error={titleNo.error}
                onChange={(e) => setTitleNo({ value: e ? e.currentTarget.value : '', error: '' })}
              >
                <p className={styles.labelText}>
                  {t(KEY.norwegian)} {t(KEY.title)}
                </p>
              </InputField>
              <TextAreaField
                className={styles.input}
                value={textNo.value}
                onChange={(e) => setTextNo({ value: e ? e.currentTarget.value : '', error: '' })}
              >
                <p className={styles.labelText}>
                  {t(KEY.norwegian)} {t(KEY.content)}
                </p>
              </TextAreaField>
            </div>
            <div className={styles.col}>
              <div className={styles.markdownField}>
                <ReactMarkdown>{textNo.value}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <h2 className={styles.inputGroupHeader}>{t(KEY.english)}</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <InputField
                className={styles.input}
                value={titleEn.value}
                error={titleEn.error}
                onChange={(e) => setTitleEn({ value: e ? e.currentTarget.value : '', error: '' })}
              >
                <p className={styles.labelText}>
                  {t(KEY.english)} {t(KEY.title)}
                </p>
              </InputField>
              <TextAreaField
                className={styles.input}
                value={textEn.value}
                onChange={(e) => setTextEn({ value: e ? e.currentTarget.value : '', error: '' })}
              >
                <p className={styles.labelText}>
                  {t(KEY.english)} {t(KEY.content)}
                </p>
              </TextAreaField>
            </div>
            <div className={styles.col}>
              <div className={styles.markdownField}>
                <ReactMarkdown>{textEn.value}</ReactMarkdown>
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

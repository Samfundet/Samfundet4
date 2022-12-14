import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPerm } from '~/utils';
import { Button, InputField, SamfundetLogoSpinner, TextAreaField } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { useParams } from 'react-router-dom';
import styles from './InformationFormAdminPage.module.scss';
import { InformationPageDto } from '~/dto';
import {  getInformationPage, postInformationPage, putInformationPage } from '~/api';
import { STATUS } from '~/http_status_codes';
import { reverse } from '~/named-urls';

export function InformationFormAdminPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const [name, setName] = useState<string>('');
  const [titleNo, setTitleNo] = useState<string>('');
  const [textNo, setTextNo] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  const [textEn, setTextEn] = useState<string>('');

  // If form has a slugfield, check if it exists, and then load that item.
  const { slugField } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    setShowSpinner(false);
  }, []);

  useEffect(() => {
    // TODO add fix on no slugfield on editpage
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setName(data.slug_field);
          setTitleNo(data.title_no);
          setTitleEn(data.title_en);
          setTextEn(data.text_en);
          setTextNo(data.text_no);
        }).catch((data) => {
          console.log(data);
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_information);
          }
          
        });
    }
  }, [slugField]);

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
      title_no: titleNo,
      title_en: titleEn,
      text_no: textNo,
      text_en: textEn,
    };
    if (slugField) {
      putInformationPage(slugField, data)
        .then((status) => {
            navigate(ROUTES.frontend.information_page_list + slugField);
        })
        .catch((e) => {
          console.log(e);
      });
    } else {
      data.slug_field = name;
      postInformationPage(data)
        .then((status) => {
          navigate(ROUTES.frontend.information_page_list + data.slug_field);
        })
        .catch((e) => {
          console.log(e);
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
        <p>{t(KEY.back)}</p>
      </Button>
      <h1>{slugField ? t(KEY.admin_information_edit_page) : t(KEY.admin_information_new_page)}</h1>
      <form onSubmit={post}>
        {!slugField && (
          <InputField value={name} onChange={(e) => setName(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>{t(KEY.name)}</p>
          </InputField>
        )}
        <div className={styles.inputGroup}>
          <h2>{t(KEY.norwegian)}</h2>
          <InputField value={titleNo} onChange={(e) => setTitleNo(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>
              {t(KEY.norwegian)} {t(KEY.title)}
            </p>
          </InputField>
          <TextAreaField value={textNo} onChange={(e) => setTextNo(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>
              {t(KEY.norwegian)} {t(KEY.content)}
            </p>
          </TextAreaField>
        </div>
        <div className={styles.inputGroup}>
          <h2>{t(KEY.english)}</h2>
          <InputField value={titleEn} onChange={(e) => setTitleEn(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>
              {t(KEY.english)} {t(KEY.title)}
            </p>
          </InputField>
          <TextAreaField value={textEn} onChange={(e) => setTextEn(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>
              {t(KEY.english)} {t(KEY.content)}
            </p>
          </TextAreaField>
        </div>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type='submit'>
            <p className={styles.submit}>
              {slugField ? t(KEY.admin_information_update_page) : t(KEY.admin_information_create_page)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

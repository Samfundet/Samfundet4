import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPerm } from '~/utils';
import { Button, InputField, SamfundetLogoSpinner, TextAreaField } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationFormAdminPage.module.scss';
import { InformationPageDto } from '~/dto';
import {  postInformationPage } from '~/api';
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

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    setShowSpinner(false);
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  // TODO ADD TRANSLATIONS pr element

  function post(event: SyntheticEvent) {
    event.preventDefault();
    const data = {
      slug_field: name,
      title_no: titleNo,
      title_en: titleNo,
      text_no: textNo,
      text_en: textNo,
    };
    postInformationPage(data)
      .then((status) => {
        navigate(ROUTES.frontend.information_page_list + data.slug_field);
        if (status === STATUS.HTTP_201_CREATED) {
          navigate(ROUTES.frontend.information_page_list);
        } else {
          console.log(status);
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
      <h1>{t(KEY.admin_information_new_page)}</h1>
      <form onSubmit={post}>
        <div className={styles.inputGroup}>
          <InputField value={name} onChange={(e) => setName(e ? e.currentTarget.value : '')}>
            <p className={styles.labelText}>{t(KEY.name)}</p>
          </InputField>
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
        <div className={styles.submitContainer}>
          <Button theme={'success'} type='submit'>
            <p className={styles.submit}>{t(KEY.admin_information_create_page)}</p>
          </Button>
        </div>
      </form>
    </Page>
  );
}

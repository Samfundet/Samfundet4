import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { getInformationPage } from '~/api';
import { Button, Page, SamfundetLogoSpinner } from '~/Components';
import { InformationPageDto } from '~/dto';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationFormAdminPage.module.scss';

export function InformationFormAdminPage() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  // If form has a slugfield, check if it exists, and then load that item.
  const { slugField } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [infoPage, setInfoPage] = useState<Partial<InformationPageDto>>({});

  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // TODO add fix on no slugfield on editpage
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          //DTOToForm(data, setValue, []);
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

  function handleOnSubmit(data: InformationPageDto) {
    if (slugField) {
      // TODO patch
    } else {
      // TODO post
    }
    alert('TODO');
  }

  const submitText = slugField ? `${t(KEY.common_save)}` : `${t(KEY.common_create)} ${t(KEY.information_page)}`;

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
      <SamfForm onChange={setInfoPage} onSubmit={handleOnSubmit} submitText={submitText}>
        {!slugField && <SamfFormField field="slug_field" type="text" label={`${t(KEY.name)}`} />}
        <div className={styles.row}>
          <SamfFormField field="title_nb" type="text" label={`${t(KEY.norwegian)} ${t(KEY.common_title)}`} />
          <SamfFormField field="title_en" type="text" label={`${t(KEY.english)} ${t(KEY.common_title)}`} />
        </div>
        <div className={styles.row_stretch}>
          <SamfFormField field="text_nb" type="text-long" label={`${t(KEY.norwegian)} ${t(KEY.content)}`} />
          <div className={styles.markdownField}>
            <ReactMarkdown>{infoPage.text_nb ?? ''}</ReactMarkdown>
          </div>
        </div>
        <div className={styles.row_stretch}>
          <SamfFormField field="text_en" type="text-long" label={`${t(KEY.english)} ${t(KEY.content)}`} />
          <div className={styles.markdownField}>
            <ReactMarkdown>{infoPage.text_en ?? ''}</ReactMarkdown>
          </div>
        </div>
      </SamfForm>
    </Page>
  );
}

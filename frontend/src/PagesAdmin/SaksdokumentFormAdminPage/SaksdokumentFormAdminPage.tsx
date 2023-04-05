import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SamfundetLogoSpinner } from '~/Components';

import { useTranslation } from 'react-i18next';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Page } from '~/Components/Page';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getSaksdokument, postSaksdokument } from '~/api';
import { SaksdokumentDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SaksdokumentFormAdminPage.module.scss';

export function SaksdokumentFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [document, setDocument] = useState<Partial<SaksdokumentDto>>();
  // Stuff to do on first render.
  //TODO add permissions on render

  // TODO get categories from API (this will not work)
  const categoryOptions: DropDownOption<string>[] = [
    { value: 'FS_REFERAT', label: 'FS_REFERAT' },
    { value: 'ARSBERETNING', label: 'ARSBERETNING' },
    { value: 'STYRET', label: 'STYRET' },
    { value: 'RADET', label: 'RADET' },
  ];
  const defaultCategoryOption: DropDownOption<string> = {
    value: document?.category ?? 'FS_REFERAT',
    label: document?.category ?? 'FS_REFERAT',
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (id) {
      getSaksdokument(id)
        .then((data) => {
          setDocument(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          console.log(data);
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin);
          }
        });
    } else {
      setShowSpinner(false);
    }
  }, [id]);

  function handleOnSubmit(data: SaksdokumentDto) {
    // Post new document
    if (id === undefined) {
      postSaksdokument(data).then(() => {
        navigate(ROUTES.frontend.admin_saksdokumenter);
      });
    } else {
      // TODO
    }
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const submitText = id ? t(KEY.common_save) : `${t(KEY.common_create)} ${t(KEY.saksdokument)}`;

  return (
    <Page>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.saksdokument)}
      </h1>
      {/* TODO: fix */}
      <SamfForm initialData={document} onSubmit={handleOnSubmit} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField
            field="title_nb"
            type="text"
            required={true}
            label={`${t(KEY.norwegian)} ${t(KEY.common_title)}`}
          />
          <SamfFormField
            field="title_en"
            type="text"
            required={true}
            label={`${t(KEY.english)} ${t(KEY.common_title)}`}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="category"
            type="options"
            options={categoryOptions}
            defaultOption={defaultCategoryOption}
            label="Type"
          />
          <SamfFormField
            field="publication_date"
            type="datetime"
            required={true}
            label={`${t(KEY.common_publication_date)}`}
          />
        </div>
        <SamfFormField type="upload-pdf" field="file" />
      </SamfForm>
    </Page>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getGang, getGangForm } from '~/api';
import { Button, Page, SamfundetLogoSpinner } from '~/Components';
import { GangDto } from '~/dto';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './GangsFormAdminPage.module.scss';

export function GangsFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [formChoices, setFormChoices] = useState<Record<string, unknown>>();
  formChoices;

  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // TODO add fix on no id on editpage
    getGangForm()
      .then((response) => {
        setFormChoices(response.data);
        setShowSpinner(false);
      })
      .catch(console.error);
    if (id) {
      getGang(id)
        .then((data) => {
          data;
          //DTOToForm(data, setValue, []);
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

  function handleOnSubmit(data: GangDto) {
    if (id) {
      // TODO patch
    } else {
      // TODO post
    }
    alert('TODO');
    console.log(JSON.stringify(data));
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const submitText = id ? t(KEY.common_save) : `${t(KEY.common_create)} ${t(KEY.gang)}`;

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_gangs)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.gang)}
      </h1>
      <SamfForm onSubmit={handleOnSubmit} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField field="name_nb" type="text" label={`${t(KEY.norwegian)} ${t(KEY.name)}`} />
          <SamfFormField field="name_en" type="text" label={`${t(KEY.english)} ${t(KEY.name)}`} />
        </div>
        <div className={styles.row}>
          <SamfFormField field="abbreviation" type="text" label={`${t(KEY.abbreviation)}`} />
          <SamfFormField field="webpage" type="text" label={`${t(KEY.webpage)}`} />
        </div>
        {/* TODO fetch options */}
        {/* <SamfFormField field="gang_type" type="options" label={`${t(KEY.webpage)}`} /> */}
        {/* <SamfFormField field="info_page" type="options" label={`${t(KEY.information_page)}`} /> */}
      </SamfForm>
    </Page>
  );
}

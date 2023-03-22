import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner } from '~/Components';

import { useTranslation } from 'react-i18next';
import { getSaksdokument, getSaksdokumentForm } from '~/api';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Page } from '~/Components/Page';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
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
  const [formChoices, setFormChoices] = useState<string[][]>();
  // Stuff to do on first render.
  //TODO add permissions on render

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getSaksdokumentForm()
      .then((data) => {
        console.log(data);
        setFormChoices(data.data.categories);
        setShowSpinner(false);
      })
      .catch(console.error);
    if (id) {
      getSaksdokument(id)
        .then((data) => {
          //DTOToForm(data, setValue, []);
          console.log(typeof data);
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

  // function onSubmit(data: SaksdokumentDto) {
  //   // Remove file from data to be updated, as it currently cannot be changed
  //   id && delete data['file'];

  //   (id ? putSaksdokument(id, data) : postSaksdokument(data))
  //     .then(() => {
  //       navigate(ROUTES.frontend.admin);
  //     })
  //     .catch((e) => {
  //       console.error(e.response.data);
  //       for (const err in e.response.data) {
  //         setError(err, { type: 'custom', message: e.response.data[err][0] });
  //       }
  //     });
  // }

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
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? t(KEY.common_edit) : t(KEY.common_create)} {t(KEY.saksdokument)}
      </h1>
      {/* TODO: fix */}
      <SamfForm
        onSubmit={() => {
          return;
        }}
        submitButton={submitText}
      >
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
            options={formChoices?.map((s: string[]) => ({ label: s[0], value: s[0] } as DropDownOption<string>))}
            label="Status"
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="publication_date"
            type="datetime"
            required={true}
            label={`${t(KEY.common_publication_date)}`}
          />
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
      </SamfForm>
    </Page>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { KEY } from '~/i18n/constants';
import styles from './MDBConnectFormAdminPage.module.scss';

type FormProps = {
  email: string;
  password: string;
};

export function MDBConnectFormAdminPage() {
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  function handleSubmit(formData: FormProps) {
    setSubmitting(true);
    console.log(formData);
    //TODO: Koble te backend
    setSubmitting(false);
  }

  return (
    <div className={styles.wrapper}>
      <h1>{t(KEY.adminpage_connect_mdb)}</h1>
      <SamfForm onSubmit={handleSubmit} isDisabled={submitting} className={styles.Form}>
        <h2>{t(KEY.common_email)}</h2>
        <SamfFormField<string, FormProps> required={true} field="email" type="text" />
        <h2>{t(KEY.common_password)}</h2>
        <SamfFormField<string, FormProps> required={true} field="password" type="password" />
      </SamfForm>
    </div>
  );
}

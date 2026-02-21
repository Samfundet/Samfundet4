import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { KEY } from '~/i18n/constants';
import styles from './MDBConnectFormAdminPage.module.scss';
import { AdminPage } from '../AdminPageLayout';
import { connect_to_mdb } from '~/api';
import { toast } from 'react-toastify';

type FormProps = {
  searchable: string;
  password: string;
};

export function MDBConnectFormAdminPage() {
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  function handleSubmit(formData: FormProps) {
    setSubmitting(true);
    const isNumber = determineIfNumber(formData.searchable)
    console.log(isNumber);
    connect_to_mdb(formData.searchable,formData.password).then(res=>{
      toast.success('TIPP TOPP TOMMEL OPP')
    }).catch((error)=>{
      toast.error(error.response.data.message)
    }).finally(()=>setSubmitting(false))
  }

  function determineIfNumber(s: string): boolean {
    const numberRegex = /^\d+$/;
    return numberRegex.test(s);
  }

  return (
    <AdminPage title={t(KEY.adminpage_connect_mdb)}>
      <div className={styles.wrapper}>
      <SamfForm onSubmit={handleSubmit} isDisabled={submitting} className={styles.Form}>
        <h2>{t(KEY.email_or_membership_number_message)}</h2>
        <SamfFormField<string, FormProps> required={true} field="searchable" type="text" />
        <h2>{t(KEY.common_password)}</h2>
        <SamfFormField<string, FormProps> required={true} field="password" type="password" />
      </SamfForm>
    </div>
    </AdminPage>
    
  );
}

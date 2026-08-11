import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { LastUpdatedByHeader } from '~/Components';
import { CaseDocumentForm } from '~/PagesAdmin/CaseDocumentFormAdminPage/CaseDocumentForm';
import { useGetCaseDocument } from '~/domain';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './CaseDocumentFormAdminPage.module.scss';

export function CaseDocumentFormAdminPage() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const params = useParams();
  const id = Number.parseInt(params.id as string);

  useEffect(() => {
    if ('id' in params && Number.isNaN(id)) {
      navigate(ROUTES.frontend.admin_casedocuments, { replace: true });
    }
  }, [params, id, navigate]);

  const { data: document, isLoading } = useGetCaseDocument(Number(id), { enabled: !Number.isNaN(id) });

  const title = id
    ? `${t(KEY.common_edit)}: ${document?.title_nb}`
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_casedocument)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={isLoading} header={<LastUpdatedByHeader model={document} />}>
      <div className={styles.form_wrapper}>
        <CaseDocumentForm document={document} />
      </div>
    </AdminPageLayout>
  );
}

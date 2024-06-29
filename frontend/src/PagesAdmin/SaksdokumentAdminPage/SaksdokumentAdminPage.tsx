import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, InputField, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { getSaksdokumenter } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import { useTitle } from '~/hooks';
import type { SaksdokumentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SaksdokumentAdminPage.module.scss';

export function SaksdokumentAdminPage() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<SaksdokumentDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();
  useTitle(t(KEY.admin_saksdokumenter_title));

  // Get documents
  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getSaksdokumenter()
      .then((data) => {
        setDocuments(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

  // Filtered
  function filterDocuments(): SaksdokumentDto[] {
    if (searchQuery === '') return documents;
    // Get keywords separated by space.
    const keywords = searchQuery.split(' ');
    // Filter by match all keywords.
    return documents.filter((doc) => {
      for (const kw of keywords) {
        if (doc.title_nb?.toLowerCase().indexOf(kw) === -1) return false;
      }
      return true;
    });
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: 'Type', sortable: true },
    { content: t(KEY.saksdokumentpage_publication_date), sortable: true },
    '', // Buttons
  ];

  // Table row for a document
  function documentTableRow(document: SaksdokumentDto) {
    return [
      dbT(document, 'title') as string,
      document.category,
      {
        content: <TimeDisplay displayType="date" timestamp={document.publication_date ?? ''} />,
        value: document.publication_date,
      },
      {
        content: (
          <CrudButtons
            onView={
              // Open document file if exists
              document.url !== null
                ? () => {
                    window.open(BACKEND_DOMAIN + document.url, '_blank');
                  }
                : undefined
            }
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_saksdokumenter_edit,
                  urlParams: { id: document.id },
                }),
              );
            }}
          />
        ),
      },
    ];
  }

  const title = t(KEY.admin_saksdokumenter_title);
  const backendUrl = ROUTES.backend.admin__samfundet_saksdokument_changelist;
  const header = (
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_saksdokumenter_create}>
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_saksdokument)}`)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <InputField icon="mdi:search" onChange={setSearchQuery} />
      <div className={styles.table_container}>
        <Table columns={tableColumns} data={filterDocuments().map((doc) => documentTableRow(doc))} />
      </div>
    </AdminPageLayout>
  );
}

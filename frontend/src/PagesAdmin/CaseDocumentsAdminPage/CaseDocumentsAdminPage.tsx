import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Input, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { BACKEND_DOMAIN } from '~/constants';
import { useGetCaseDocumentCategories, useGetCaseDocuments } from '~/domain';
import type { CaseDocumentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './CaseDocumentsAdminPage.module.scss';

export function CaseDocumentsAdminPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState<string>('');
  const { t } = useTranslation();
  useTitle(t(KEY.admin_casedocuments_title));

  const { data: documents, isLoading: documentsLoading } = useGetCaseDocuments();
  const { data: categories, isLoading: categoriesLoading } = useGetCaseDocumentCategories();

  const isLoading = documentsLoading || categoriesLoading;

  // Filtered
  function filterDocuments(): CaseDocumentDto[] {
    if (searchInput === '') return documents || [];
    // Get keywords separated by space.
    const keywords = searchInput.split(' ');
    // Filter by match all keywords.
    return (
      documents?.filter((doc) => {
        for (const kw of keywords) {
          if (doc.title_nb?.toLowerCase().indexOf(kw.toLowerCase()) === -1) return false;
        }
        return true;
      }) || []
    );
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: 'Type', sortable: true },
    { content: t(KEY.common_publication_date), sortable: true },
    '', // Buttons
  ];

  // Table row for a document
  function documentTableRow(document: CaseDocumentDto) {
    return [
      dbT(document, 'title') as string,
      categories?.find((cat) => cat.value === document.category)?.label || document.category,
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
                  pattern: ROUTES.frontend.admin_casedocuments_edit,
                  urlParams: { id: document.id },
                }),
              );
            }}
          />
        ),
      },
    ];
  }

  const title = t(KEY.admin_casedocuments_title);
  const backendUrl = ROUTES.backend.admin__samfundet_saksdokument_changelist;
  const header = (
    <Button theme="primary" link={ROUTES.frontend.admin_casedocuments_create}>
      <Icon icon="lucide:upload" />
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_casedocument)}`)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <Input
        type="text"
        icon="mdi:search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={`${t(KEY.common_search)}...`}
      />

      <div className={styles.table_container}>
        <Table columns={tableColumns} data={filterDocuments().map((doc) => ({ cells: documentTableRow(doc) }))} />
      </div>
    </AdminPageLayout>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, InputField, Link, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { Table } from '~/Components/Table';
import { getSaksdokumenter } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import { SaksdokumentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './SaksdokumentAdminPage.module.scss';

export function SaksdokumentAdminPage() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<SaksdokumentDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();

  // Get documents
  useEffect(() => {
    getSaksdokumenter()
      .then((data) => {
        setDocuments(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

  // Loading
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  // Filtered
  function filterDocuments(): SaksdokumentDto[] {
    if (searchQuery === '') return documents;
    // Get keywords separated by space
    const keywords = searchQuery.split(' ');
    // Filter by match all keywords
    return documents.filter((doc) => {
      for (const kw of keywords) {
        if (doc.title_nb?.toLowerCase().indexOf(kw) == -1) return false;
      }
      return true;
    });
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: 'Type', sortable: true },
    { content: t(KEY.common_publication_date), sortable: true },
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

  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_saksdokumenter_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_saksdokument_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_saksdokumenter_create)}>
        {t(KEY.common_create)} {t(KEY.saksdokument)}
      </Button>
      <br></br>
      <InputField icon="mdi:search" onChange={setSearchQuery} />
      <Table columns={tableColumns} data={filterDocuments().map((doc) => documentTableRow(doc))} />
    </Page>
  );
}

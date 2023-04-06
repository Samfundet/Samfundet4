import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { Table } from '~/Components/Table';
import { getSaksdokumenter } from '~/api';
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
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getSaksdokumenter()
      .then((data) => {
        setDocuments(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: 'Type', sortable: true },
    { content: t(KEY.saksdokumentpage_publication_date), sortable: true },
    '', // Buttons
  ];

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
        {t(KEY.common_create)} {t(KEY.admin_saksdokument)}
      </Button>
      <br></br>
      <Table
        columns={tableColumns}
        data={documents.map(function (document) {
          return [
            dbT(document, 'title') as string,
            document.category,
            document.publication_date,
            {
              content: (
                <CrudButtons
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
        })}
      />
    </Page>
  );
}

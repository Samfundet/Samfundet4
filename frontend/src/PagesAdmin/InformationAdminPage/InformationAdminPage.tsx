import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { Table } from '~/Components/Table';
import { deleteInformationPage, getInformationPages } from '~/api';
import { InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './InformationAdminPage.module.scss';

export function InformationAdminPage() {
  const navigate = useNavigate();
  const [informationPages, setInformationPages] = useState<InformationPageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    getInformationPages()
      .then((data) => {
        setInformationPages(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

  function deletePage(slug_field: string | undefined) {
    if (!slug_field) return;

    deleteInformationPage(slug_field).then(() => {
      getInformationPages()
        .then((data) => {
          setInformationPages(data);
          setShowSpinner(false);
        })
        .catch(console.error);
    });
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.owner), sortable: true },
    { content: t(KEY.last_updated), sortable: true },
    '', // Buttons
  ];

  const data = informationPages.map(function (element) {
    const pageUrl = reverse({
      pattern: ROUTES.frontend.information_page_detail,
      urlParams: { slugField: element.slug_field },
    });

    return [
      { content: <Link url={pageUrl}>{pageUrl}</Link>, value: pageUrl },
      dbT(element, 'title'),
      'To be added',
      'To be added',
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate(pageUrl);
            }}
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_information_edit,
                  urlParams: { slugField: element.slug_field },
                }),
              );
            }}
            onDelete={() => {
              if (window.confirm(t(KEY.admin_information_confirm_delete) ?? '')) {
                deletePage(element.slug_field);
              }
            }}
          />
        ),
      },
    ];
  });

  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_information_manage_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_informationpage_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_information_create)}>
        {t(KEY.common_create)} {t(KEY.information_page_short)}
      </Button>
      <div className={styles.tableContainer}>
        <Table columns={tableColumns} data={data} />
      </div>
    </Page>
  );
}

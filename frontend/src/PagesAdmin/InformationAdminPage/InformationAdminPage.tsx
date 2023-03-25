import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteInformationPage, getInformationPages } from '~/api';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { AlphabeticTableCell, ITableCell, Table } from '~/Components/Table';
import { InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/i18n/i18n';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './InformationAdminPage.module.scss';

export function InformationAdminPage() {
  const navigate = useNavigate();
  const [informationPages, setInformationPages] = useState<InformationPageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

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

  const data = informationPages.map(function (element) {
    return [
      new AlphabeticTableCell(
        reverse({
          pattern: ROUTES.frontend.information_page_detail,
          urlParams: { slugField: element.slug_field },
        }),
      ),
      new AlphabeticTableCell(dbT(element, 'title', i18n.language) as string),
      new AlphabeticTableCell('To be added'),
      new AlphabeticTableCell('To be added'),
      {
        children: (
          <CrudButtons
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.information_page_edit,
                  urlParams: { slugField: element.slug_field },
                }),
              );
            }}
            onDelete={() => {
              if (window.confirm(t(KEY.admin_information_confirm_delete) as string)) {
                deletePage(element.slug_field);
              }
            }}
          />
        ),
      } as ITableCell,
    ];
  });

  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
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
        <Table columns={[t(KEY.name), t(KEY.common_title), t(KEY.owner), t(KEY.last_updated), '']} data={data} />
      </div>
    </Page>
  );
}

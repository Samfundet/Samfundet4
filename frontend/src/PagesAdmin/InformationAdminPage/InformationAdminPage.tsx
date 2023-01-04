import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationAdminPage.module.scss';
import { InformationPageDto } from '~/dto';
import { deleteInformationPage, getInformationPages } from '~/api';
import { Table, AlphabeticTableCell, ITableCell } from '~/Components/Table';
import { reverse } from '~/named-urls';

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

  function deletePage(slug_field: string) {
    deleteInformationPage(slug_field).then((response) => {
      console.log(response);
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
        <Table
          columns={[t(KEY.name), t(KEY.common_title), t(KEY.owner), t(KEY.last_updated), '']}
          data={informationPages.map(function (element) {
            return [
              new AlphabeticTableCell(
                (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.information_page_detail,
                      urlParams: { slugField: element.slug_field },
                    })}
                  >
                    {element.slug_field}
                  </Link>
                ),
              ),
              new AlphabeticTableCell(element.title_no),
              new AlphabeticTableCell('To be added'),
              new AlphabeticTableCell('To be added'),
              {
                children: (
                  <div>
                    <Button
                      theme="blue"
                      onClick={() => {
                        navigate(
                          reverse({
                            pattern: ROUTES.frontend.information_page_edit,
                            urlParams: { slugField: element.slug_field },
                          }),
                        );
                      }}
                    >
                      {t(KEY.edit)}
                    </Button>
                    <Button
                      theme="samf"
                      onClick={() => {
                        if (window.confirm(t(KEY.admin_information_confirm_delete))) {
                          deletePage(element.slug_field);
                        }
                      }}
                    >
                      {t(KEY.delete)}
                    </Button>{' '}
                  </div>
                ),
              } as ITableCell,
            ];
          })}
        />
      </div>
    </Page>
  );
}

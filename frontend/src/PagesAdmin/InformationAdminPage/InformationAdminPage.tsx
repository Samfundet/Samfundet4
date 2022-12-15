import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPerm } from '~/utils';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './InformationAdminPage.module.scss';
import { InformationPageDto } from '~/dto';
import { deleteInformationPage, getInformationPages } from '~/api';
import { Table } from '~/Components/Table';

export function InformationAdminPage() {
  const { user } = useAuthContext();
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
        <p>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_information_manage_title)}</h1>
        <Link target='backend' url={ROUTES.backend.admin__samfundet_informationpage_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_information_create)}>
        {t(KEY.admin_information_new_page)}
      </Button>
      <div className={styles.tableContainer}>
        <Table
          cols={[
            [t(KEY.name), 1],
            [t(KEY.title), 1],
            [t(KEY.owner), 1],
            [t(KEY.last_updated), 1],
            ['', 1],
          ]}
        >
          {informationPages.map(function (element, key) {
            return (
              <tr key={key}>
                <td>{element.slug_field}</td>
                <td>{element.title_no}</td>
                <td>Legg til</td>
                <td>Legg til</td>
                <td>
                  <Button
                    theme="blue"
                    onClick={() => navigate(ROUTES.frontend.admin_information + 'edit/' + element.slug_field)}
                  >
                    {t(KEY.edit)}
                  </Button>
                  <Button
                    theme="samf"
                    onClick={() => {
                      if (window.confirm('Are you sure to delete this informationpage?')) {
                        deletePage(element.slug_field);
                      }
                    }}
                  >
                    {t(KEY.delete)}
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </Page>
  );
}

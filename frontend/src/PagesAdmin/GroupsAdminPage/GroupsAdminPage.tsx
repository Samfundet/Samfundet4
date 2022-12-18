import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './GroupsAdminPage.module.scss';
import { GangTypeDto } from '~/dto';
import { getGangList } from '~/api';
import { Table } from '~/Components/Table';

export function GroupsAdminPage() {
  const navigate = useNavigate();
  const [gangTypes, setGangs] = useState<GangTypeDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getGangList()
      .then((data) => {
        setGangs(data);
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
  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_gangs_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_gang_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin)}>
        {t(KEY.admin_gangs_create)}
      </Button>
      {gangTypes.map(function (element, key) {
        return (
          <div key={key}>
            <h2 className={styles.gangTypeHeader}>{element.title_no}</h2>
            <Table
              cols={[
                ['Gjeng', 2],
                ['Forkortelse', 2],
                ['Nettside', 1],
                ['', 1],
              ]}
            >
              {element.gangs.map(function (element2, key2) {
                return (
                  <tr key={key2}>
                    <td>
                      <Link>{element2.name_no}</Link>
                    </td>
                    <td>{element2.abbreviation}</td>
                    <td>{element2.webpage}</td>
                    <td>
                      <Button theme="blue">Rediger gjeng</Button>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </div>
        );
      })}
    </Page>
  );
}

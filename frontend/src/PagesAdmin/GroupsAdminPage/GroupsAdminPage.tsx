import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPerm } from '~/utils';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './GroupsAdminPage.module.scss';
import { GangTypeDto } from '~/dto';
import { getGangList } from '~/api';

export function GroupsAdminPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [gangTypes, setGangs] = useState<GangTypeDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  //TODO add permissions on render
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
        <p>{t(KEY.back)}</p>
      </Button>
      <h1>{t(KEY.admin_gangs_title)}</h1>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin)}>
        {t(KEY.admin_gangs_create)}
      </Button>
      {gangTypes.map(function (element, key) {
        return (
          <div key={key}>
            <h3>{element.title_no}</h3>
            <table className={styles.samfTable}>
              <colgroup>
                <col span='2'/>
                <col span='2'/>
                <col span='1'/>
                <col span='1'/>
              </colgroup>
              <thead className={styles.tableHeader}>
                <th>Gjeng</th>
                <th>Forkortelse</th>
                <th>Webside</th>
                <th></th>
              </thead>
              <tbody>
                {element.gangs.map(function (element2, key2) {
                  return (
                    <tr key={key2}>
                      <td style={{ width: '30%' }}>
                        <Link>{element2.name_no}</Link>
                      </td>
                      <td style={{ width: '30%' }}>{element2.abbreviation}</td>
                      <td style={{ width: '20%' }}>{element2.webpage}</td>
                      <td style={{ width: '20%' }}>
                        <Button theme="blue">Rediger gjeng</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </Page>
  );
}

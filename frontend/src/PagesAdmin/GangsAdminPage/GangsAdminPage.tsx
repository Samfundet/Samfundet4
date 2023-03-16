import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getGangList } from '~/api';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { AlphabeticTableCell, Table } from '~/Components/Table';
import { GangTypeDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/i18n/i18n';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './GangsAdminPage.module.scss';

export function GangsAdminPage() {
  const navigate = useNavigate();
  const [gangTypes, setGangs] = useState<GangTypeDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

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
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
        {t(KEY.admin_gangs_create)}
      </Button>
      {gangTypes.map(function (element, key) {
        return (
          <div key={key}>
            <h2 className={styles.gangTypeHeader}>{dbT(element, 'title', i18n.language) as string}</h2>
            <Table
              columns={[t(KEY.gang), t(KEY.abbreviation), t(KEY.webpage), '']}
              data={element.gangs.map(function (element2) {
                return [
                  new AlphabeticTableCell(
                    // <Link
                    //   url={
                    //     element2.info_page &&
                    //     reverse({
                    //       pattern: ROUTES.frontend.information_page_detail,
                    //       urlParams: { slugField: element2.info_page },
                    //     })
                    //   }
                    // >
                    //   {dbT(element2, 'name', i18n.language) as string}
                    // </Link>
                    dbT(element2, 'name', i18n.language) as string,
                  ),
                  new AlphabeticTableCell(element2.abbreviation),
                  new AlphabeticTableCell(element2.webpage),
                  {
                    children: (
                      <Button
                        onClick={() =>
                          navigate(
                            reverse({
                              pattern: ROUTES.frontend.admin_gangs_edit,
                              urlParams: { id: element2.id },
                            }),
                          )
                        }
                        theme="blue"
                      >
                        Rediger gjeng
                      </Button>
                    ),
                  },
                ];
              })}
            />
          </div>
        );
      })}
    </Page>
  );
}

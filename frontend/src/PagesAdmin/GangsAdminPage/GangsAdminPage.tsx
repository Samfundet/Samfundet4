import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getGangList } from '~/api';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
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
  const [currentGangTypeTab, setGangTypeTab] = useState<Tab<GangTypeDto> | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getGangList()
      .then((data) => {
        setGangs(data);
        setShowSpinner(false);
        setGangTypeTab({
          key: data[0].id,
          label: dbT(data[0], 'title', i18n.language) ?? '?',
          value: data[0],
        });
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const gangTypeTabs: Tab<GangTypeDto>[] = gangTypes.map((gangType) => {
    return {
      key: gangType.id,
      label: dbT(gangType, 'title', i18n.language) ?? '?',
      value: gangType,
    };
  });

  const currentGangType = currentGangTypeTab?.value;

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

      <br></br>
      <TabBar tabs={gangTypeTabs} selected={currentGangTypeTab} onSetTab={setGangTypeTab}></TabBar>
      <br></br>

      {currentGangType && (
        <>
          <Table
            columns={[t(KEY.gang), t(KEY.abbreviation), t(KEY.webpage), '']}
            data={currentGangType.gangs.map(function (element2) {
              return [
                new AlphabeticTableCell(dbT(element2, 'name', i18n.language) as string),
                new AlphabeticTableCell(element2.abbreviation),
                new AlphabeticTableCell(element2.webpage),
                {
                  children: (
                    <CrudButtons
                      onEdit={() => {
                        navigate(
                          reverse({
                            pattern: ROUTES.frontend.admin_gangs_edit,
                            urlParams: { id: element2.id },
                          }),
                        );
                      }}
                    />
                  ),
                },
              ];
            })}
          />
        </>
      )}
    </Page>
  );
}

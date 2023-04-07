import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { Table } from '~/Components/Table';
import { getGangList } from '~/api';
import { GangTypeDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './GangsAdminPage.module.scss';

export function GangsAdminPage() {
  const navigate = useNavigate();
  const [gangTypes, setGangs] = useState<GangTypeDto[]>([]);
  const [currentGangTypeTab, setGangTypeTab] = useState<Tab<GangTypeDto> | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getGangList()
      .then((data) => {
        setGangs(data);
        setShowSpinner(false);
        setGangTypeTab({
          key: data[0].id,
          label: dbT(data[0], 'title') ?? '?',
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
      label: dbT(gangType, 'title') ?? '?',
      value: gangType,
    };
  });

  const currentGangType = currentGangTypeTab?.value;

  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.adminpage_gangs_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_gang_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
        {t(KEY.adminpage_gangs_create)}
      </Button>

      <br></br>
      <TabBar tabs={gangTypeTabs} selected={currentGangTypeTab} onSetTab={setGangTypeTab}></TabBar>
      <br></br>

      {currentGangType && (
        <>
          <Table
            columns={[
              t(KEY.common_gang) ?? '',
              t(KEY.admin_gangsadminpage_abbreviation) ?? '',
              t(KEY.admin_gangsadminpage_webpage) ?? '',
              '',
            ]}
            data={currentGangType.gangs.map(function (element2) {
              return [
                dbT(element2, 'name'),
                element2.abbreviation,
                element2.webpage,
                {
                  content: (
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

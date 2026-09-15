import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, H2, Link } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { useAuthContext } from '~/context/AuthContext';
import { useGetAdminGangs } from '~/domain/gangs/queries';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { dbT, hasPermissions } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './GangsAdminPage.module.scss';

export function GangsAdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { data, isLoading } = useGetAdminGangs();

  const title = t(KEY.adminpage_gangs_title);

  useTitle(title);

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_GANG], undefined, true);
  const canEdit = hasPermissions(user, [PERM.SAMFUNDET_ADD_GANG], undefined, true);

  const orgTables = useMemo(() => {
    if (!data) {
      return <></>;
    }

    return (
      <div>
        {data.map((org) => {
          const tableData = org.gangs.map((gang) => ({
            cells: [
              {
                content: gang.logo && <img className={styles.logo} src={gang.logo} alt="" />,
              },
              {
                content: (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_gangs_view,
                      urlParams: { gangId: gang.id },
                    })}
                  >
                    {dbT(gang, 'name')}
                  </Link>
                ),
              },
              gang.abbreviation,
              gang.gang_type ? dbT(gang.gang_type, 'title') ?? t(KEY.common_unknown) : '',
              gang.webpage
                ? {
                    content: (
                      <Link url={gang.webpage} target="external">
                        {gang.webpage}
                      </Link>
                    ),
                  }
                : '',
              {
                content: (
                  <CrudButtons
                    onEdit={
                      canEdit &&
                      reverse({
                        pattern: ROUTES.frontend.admin_gangs_edit,
                        urlParams: { gangId: gang.id },
                      })
                    }
                  />
                ),
              },
            ],
          }));

          return (
            <div key={org.id} style={{ marginBottom: '1rem' }}>
              <H2>{org.name}</H2>

              <Table
                columns={[
                  '',
                  t(KEY.common_gang) ?? '',
                  t(KEY.admin_gangsadminpage_abbreviation) ?? '',
                  t(KEY.common_gang_type) ?? '',
                  t(KEY.admin_gangsadminpage_webpage) ?? '',
                  '',
                ]}
                data={tableData ?? []}
                bodyRowClassName={styles.row}
              />
            </div>
          );
        })}
      </div>
    );
  }, [data, canEdit, t]);

  data?.flatMap((gangType) =>
    gangType.gangs.map((gang) => ({
      cells: [
        {
          content: gang.logo && <img className={styles.logo} src={gang.logo} alt="" />,
        },
        dbT(gang, 'name'),
        gang.abbreviation,
        gang.webpage
          ? {
              content: (
                <Link url={gang.webpage} target="external">
                  {gang.webpage}
                </Link>
              ),
            }
          : '',
        dbT(gangType, 'title') ?? t(KEY.common_unknown),
        {
          content: (
            <CrudButtons
              onEdit={
                canEdit &&
                reverse({
                  pattern: ROUTES.frontend.admin_gangs_edit,
                  urlParams: { gangId: gang.id },
                })
              }
            />
          ),
        },
      ],
    })),
  );

  const header = (
    <>
      {canCreate && (
        <Button theme="primary" onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
          <Icon icon="lucide:plus" />
          {t(KEY.adminpage_gangs_create)}
        </Button>
      )}
    </>
  );

  return (
    <AdminPageLayout
      title={title}
      backendUrl={ROUTES.backend.admin__samfundet_gang_changelist}
      header={header}
      loading={isLoading}
    >
      {orgTables}
    </AdminPageLayout>
  );
}

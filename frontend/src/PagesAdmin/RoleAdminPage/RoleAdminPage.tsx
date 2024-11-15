import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';
import { H1, Link, Table } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRoleUsers } from '~/api';
import type { UserGangSectionRoleDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { RoleLoader } from '~/router/loaders';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { dbT, formatDateYMD, getFullName } from '~/utils';

export function RoleAdminPage() {
  const { t } = useTranslation();
  const { role } = useRouteLoaderData('role') as RoleLoader;

  const title = `${t(KEY.common_role)}: ${role?.name}`;

  useTitle(title);

  const { data, isLoading } = useQuery({
    queryKey: ['roleusers', role?.id],
    queryFn: () => {
      if (!role) {
        return;
      }
      return getRoleUsers(role.id);
    },
  });

  const usersColumns = [
    `${t(KEY.common_name)}`,
    `${t(KEY.common_role)}`,
    'Org/Gang/Section',
    'Hatt rollen siden',
    'Gitt av',
  ];

  const usersData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((ru) => {
      const fullName = getFullName(ru.user) || ru.user.username;
      if (ru.org_role) {
        return {
          cells: [
            { content: fullName, value: fullName },
            { content: '', value: '' },
            {
              content: (
                <>
                  {t(KEY.recruitment_organization)}: ${ru.org_role.organization.name}
                </>
              ),
              value: ru.org_role.organization.name,
            },
            { content: formatDateYMD(new Date(ru.org_role.created_at)) },
            { content: ru.org_role.created_by ? getFullName(ru.org_role.created_by) : '' },
          ],
        };
      }
      if (ru.gang_role) {
        return {
          cells: [
            { content: fullName, value: fullName },
            { content: '', value: '' },
            {
              content: (
                <Link
                  url={reverse({
                    pattern: ROUTES_FRONTEND.admin_gangs_edit,
                    urlParams: { gangId: ru.gang_role.gang.id },
                  })}
                >
                  {t(KEY.common_gang)}: {dbT(ru.gang_role.gang, 'name')}
                </Link>
              ),
              value: dbT(ru.gang_role.gang, 'name'),
            },
            { content: formatDateYMD(new Date(ru.gang_role.created_at)) },
            { content: ru.gang_role.created_by ? getFullName(ru.gang_role.created_by) : '' },
          ],
        };
      }
      // There is no other possibility at this stage, section_role is guaranteed to be present here
      const sectionRole = ru.section_role as UserGangSectionRoleDto;
      return {
        cells: [
          { content: fullName, value: fullName },
          { content: '', value: '' },
          {
            content: (
              <>
                {t(KEY.common_section)}: {dbT(sectionRole.section, 'name')}
              </>
            ),
            value: dbT(sectionRole.section, 'name'),
          },
          { content: formatDateYMD(new Date(sectionRole.created_at)) },
          { content: sectionRole.created_by ? getFullName(sectionRole.created_by) : '' },
        ],
      };
    });
  }, [data, t]);

  return (
    <AdminPageLayout title={title}>
      <H1>{t(KEY.common_users)}</H1>

      {isLoading ? <span>Loading</span> : <Table columns={usersColumns} data={usersData} />}
    </AdminPageLayout>
  );
}

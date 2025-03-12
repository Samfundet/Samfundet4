import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { H1, Link, Table } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRoleUsers } from '~/api';
import type { RoleDto, RoleUsersDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { roleKeys } from '~/queryKeys';
import type { RoleLoader } from '~/router/loaders';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { dbT, formatDateYMDWithTime, getFullDisplayName } from '~/utils';

function getCreatedInfo(ru: RoleUsersDto) {
  const roleData = ru.org_role || ru.gang_role || ru.section_role;
  return {
    createdAt: roleData?.created_at ? formatDateYMDWithTime(new Date(roleData.created_at)) : '',
    createdBy: roleData?.created_by ? getFullDisplayName(roleData.created_by) : '',
  };
}

export function RoleAdminPage() {
  const { t } = useTranslation();
  const { role } = useRouteLoaderData('role') as RoleLoader;

  const title = `${t(KEY.common_role)}: ${role?.name}`;

  useTitle(title);

  const { data, isLoading } = useQuery({
    queryKey: roleKeys.users((role as RoleDto).id),
    queryFn: () => (role ? getRoleUsers(role.id) : undefined),
    enabled: !!role,
  });

  const usersColumns = [
    t(KEY.common_name),
    t(KEY.admin_role_page_orggangsection),
    t(KEY.admin_role_page_role_since),
    t(KEY.admin_role_page_given_by),
  ];

  const getRoleInfo = useCallback(
    (ru: RoleUsersDto) => {
      if (ru.org_role) {
        return {
          content: (
            <>
              {t(KEY.recruitment_organization)}: {ru.org_role.organization.name}
            </>
          ),
          value: ru.org_role.organization.name,
        };
      }

      if (ru.gang_role) {
        return {
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
        };
      }

      if (ru.section_role) {
        return {
          content: (
            <>
              {t(KEY.common_section)}: {dbT(ru.section_role.section, 'name')}
            </>
          ),
          value: dbT(ru.section_role.section, 'name'),
        };
      }

      // We'll never end up here, but just in case the API changes...
      return { content: '', value: '' };
    },
    [t],
  );

  const usersData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((ru) => {
      const fullName = getFullDisplayName(ru.user);
      const roleInfo = getRoleInfo(ru);
      const { createdAt, createdBy } = getCreatedInfo(ru);

      return {
        cells: [
          { content: fullName, value: fullName },
          { content: roleInfo.content, value: roleInfo.value },
          { content: createdAt, value: createdAt },
          { content: createdBy, value: createdBy },
        ],
      };
    });
  }, [data, getRoleInfo]);

  return (
    <AdminPageLayout title={title}>
      <H1>{t(KEY.common_users)}</H1>

      {isLoading ? <span>Loading</span> : <Table columns={usersColumns} data={usersData} />}
    </AdminPageLayout>
  );
}

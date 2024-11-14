import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';
import { H1, Table } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRoleUsers } from '~/api';
import type { UserGangSectionRoleDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { RoleLoader } from '~/router/loaders';
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

  const usersColumns = [`${t(KEY.common_name)}`, `${t(KEY.common_role)}`, 'Org/Gang/Section', 'Hatt rollen siden'];

  const usersData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((ru) => {
      const fullName = getFullName(ru.user);
      if (ru.org_role) {
        return {
          cells: [
            { content: fullName, value: fullName },
            { content: ru.org_role.organization.name, value: ru.org_role.organization.name },
            { content: '', value: '' },
            { content: formatDateYMD(new Date(ru.org_role.created_at)) },
          ],
        };
      }
      if (ru.gang_role) {
        return {
          cells: [
            { content: fullName, value: fullName },
            { content: dbT(ru.gang_role.gang, 'name'), value: dbT(ru.gang_role.gang, 'name') },
            { content: '', value: '' },
            { content: formatDateYMD(new Date(ru.gang_role.created_at)) },
          ],
        };
      }
      // There is no other possibility at this stage, section_role is guaranteed to be present here
      const sectionRole = ru.section_role as UserGangSectionRoleDto;
      return {
        cells: [
          { content: fullName, value: fullName },
          { content: dbT(sectionRole.section, 'name'), value: dbT(sectionRole.section, 'name') },
          { content: '', value: '' },
          { content: formatDateYMD(new Date(sectionRole.created_at)) },
        ],
      };
    });
  }, [data]);

  return (
    <AdminPageLayout title={title}>
      <H1>{t(KEY.common_users)}</H1>

      {isLoading ? <span>Loading</span> : <Table columns={usersColumns} data={usersData} />}
    </AdminPageLayout>
  );
}

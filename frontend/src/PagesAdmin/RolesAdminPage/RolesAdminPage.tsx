import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CrudButtons } from '~/Components';
import { Table } from '~/Components/Table';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import type { RoleDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { lowerCapitalize } from '~/utils';

export function RolesAdminPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [roles, setRoles] = useState<RoleDto[]>([
    {
      id: 1,
      name: 'Opptaksansvarlig',
      permissions: ['samfundet.test_permission', 'samfundet.user_create'],
    },
    {
      id: 2,
      name: 'Intervjuer',
      permissions: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { content: t(KEY.common_name), sortable: true },
    { content: lowerCapitalize(`${t(KEY.common_count)} ${t(KEY.common_permissions)}`), sortable: true },
    { content: lowerCapitalize(`${t(KEY.common_count)} ${t(KEY.common_users)}`), sortable: true },
    { content: '' },
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate does not need to be in deplist
  const data = useMemo(() => {
    if (!roles) return [];
    return roles.map((r) => {
      return [
        {
          content: r.name,
          value: r.name,
        },
        {
          content: r.permissions.length,
          value: r.permissions.length,
        },
        {
          content: 0,
          value: 0,
        },
        {
          content: <CrudButtons onEdit={() => navigate('#')} />,
        },
      ];
    });
  }, [roles]);

  return (
    <AdminPageLayout title={t(KEY.common_roles)} loading={loading}>
      <Table data={data} columns={columns} />
    </AdminPageLayout>
  );
}

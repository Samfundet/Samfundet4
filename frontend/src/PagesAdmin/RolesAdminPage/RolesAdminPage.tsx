import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, CrudButtons, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRoles } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';

export function RolesAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t(KEY.common_roles);
  useTitle(title);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

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
      return {
        cells: [
          {
            content: <Link url={r.id.toString()}>{r.name}</Link>,
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
            content: (
              <CrudButtons
                onEdit={() =>
                  navigate(
                    reverse({
                      pattern: ROUTES.frontend.admin_roles_edit,
                      urlParams: { roleId: r.id },
                    }),
                  )
                }
              />
            ),
          },
        ],
      };
    });
  }, [roles]);

  const header = (
    <Button theme="success" link={ROUTES.frontend.admin_roles_create} rounded>
      {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_role)}`)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} loading={isLoading} header={header}>
      <Table data={data} columns={columns} />
    </AdminPageLayout>
  );
}

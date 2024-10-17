import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { formatDate } from '~/Components/OccupiedForm/utils';
import { Table } from '~/Components/Table';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getUsers } from '~/api';
import type { UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { getFullName } from '~/utils';
import { ImpersonateButton } from './components';

export function UsersAdminPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserDto[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch((err) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [t]);

  const columns = [
    { content: t(KEY.common_username), sortable: true },
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_active), sortable: true },
    { content: t(KEY.admin_users_last_active), sortable: true },
    { content: '' },
  ];

  const data = useMemo(() => {
    if (!users) return [];
    return users.map((u) => {
      return {
        cells: [
          {
            content: u.username,
            value: u.username,
          },
          {
            content: getFullName(u),
            value: getFullName(u),
          },
          {
            content: u.email,
            value: u.email,
          },
          {
            content: u.is_active ? t(KEY.common_yes) : '',
            value: u.is_active,
          },
          {
            content: u.last_login ? formatDate(new Date(u.last_login)) : '',
            value: u.last_login || undefined,
          },
          {
            content: <ImpersonateButton userId={u.id} />,
          },
        ],
      };
    });
  }, [t, users]);

  return (
    <AdminPageLayout title={t(KEY.common_users)} loading={loading}>
      <Table data={data} columns={columns} />
    </AdminPageLayout>
  );
}

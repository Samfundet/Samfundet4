import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { formatDate } from '~/Components/OccupiedForm/utils';
import { Table } from '~/Components/Table';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getUsers } from '~/api';
import type { UserDto } from '~/dto';
import { useDebounce } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { getFullName } from '~/utils';
import styles from './UsersAdminPage.module.scss';
import { ImpersonateButton } from './components';

export function UsersAdminPage() {
  const { t } = useTranslation();
  const title: string = t(KEY.common_users);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: users = [] } = useQuery({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => getUsers(debouncedSearchTerm),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  function handleSearchQuery(searchString: string) {
    setSearchTerm(searchString);
  }

  const userColumns = [
    { content: t(KEY.common_username), sortable: true },
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_active), sortable: true },
    { content: t(KEY.admin_users_last_active), sortable: true },
    { content: '' },
  ];

  function userTableRow(user: UserDto) {
    return [
      {
        content: user.username,
        value: user.username,
      },
      {
        content: getFullName(user),
        value: getFullName(user),
      },
      {
        content: user.email,
        value: user.email,
      },
      {
        content: user.is_active ? t(KEY.common_yes) : '',
        value: user.is_active,
      },
      {
        content: user.last_login ? formatDate(new Date(user.last_login)) : '',
        value: user.last_login || undefined,
      },
      {
        content: <ImpersonateButton userId={user.id} />,
      },
    ];
  }

  return (
    <AdminPageLayout title={title}>
      <InputField icon="mdi:search" onChange={handleSearchQuery} />
      <div className={styles.table_container}>
        <Table data={users.map((user) => ({ cells: userTableRow(user) }))} columns={userColumns} />
      </div>
    </AdminPageLayout>
  );
}

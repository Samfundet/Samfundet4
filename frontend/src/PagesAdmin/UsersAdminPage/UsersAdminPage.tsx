import { useTranslation } from 'react-i18next';
import { PagedPagination, Table } from '~/Components';
import { formatDate } from '~/Components/OccupiedForm/utils';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getUsersPaginated } from '~/api';
import type { UserDto } from '~/dto';
import { usePaginatedQuery, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { getFullName } from '~/utils';
import { ImpersonateButton } from './components';

export function UsersAdminPage() {
  const { t } = useTranslation();
  const title = t(KEY.common_users);
  useTitle(title);

  const {
    data: users,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    isLoading,
  } = usePaginatedQuery<UserDto>({
    queryKey: ['admin-users'],
    queryFn: (page: number) => getUsersPaginated(page),
  });

  const columns = [
    { content: t(KEY.common_username), sortable: true },
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_active), sortable: true },
    { content: t(KEY.admin_users_last_active), sortable: true },
    { content: '' },
  ];

  const tableData = users.map((u) => {
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

  return (
    <AdminPageLayout title={title} loading={isLoading}>
      {totalPages > 1 && (
        <PagedPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
      <Table data={tableData} columns={columns} />
    </AdminPageLayout>
  );
}

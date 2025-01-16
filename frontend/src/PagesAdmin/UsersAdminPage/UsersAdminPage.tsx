import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getUsers } from '~/api';
import { InputField } from '~/Components';
import { formatDate } from '~/Components/OccupiedForm/utils';
import { Table } from '~/Components/Table';
import type { UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { ROUTES } from '~/routes';
import { getFullName } from '~/utils';
import { ImpersonateButton } from './components';
import styles from './UsersAdminPage.module.scss';




export function UsersAdminPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const title: string = t(KEY.common_users);
  const backendUrl = ROUTES.backend.admin__samfundet_user_changelist;
  
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
  

  function filterUsers(): UserDto[] {
    if (searchQuery === '') return users;
    const keywords = searchQuery.split(' ');
    return users.filter((usr: UserDto) => {
      for (const kw of keywords) {
        const fullname = `${usr.first_name} ${usr.last_name}`
        if (fullname?.toLowerCase().indexOf(kw.toLowerCase()) === -1) return false;
      }
      return true;
    });
  }
  
  const userColumns = [
    { content: t(KEY.common_username), sortable: true },
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_active), sortable: true },
    { content: t(KEY.admin_users_last_active), sortable: true },
    { content: '' },
  ];

  function userTableRow(user: UserDto){
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
    ]
  }

  
  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} loading={loading} > 
      <InputField icon='mdi:search' onChange={setSearchQuery} />
      <div className={styles.table_container}>
        <Table columns={userColumns} data={filterUsers().map((doc)=>({cells: userTableRow(doc)}))} />
      </div>
    </AdminPageLayout>
  );
}

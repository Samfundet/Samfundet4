import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { Table } from '~/Components/Table';
import { getApplicantsWithoutInterviews } from '~/api';
import { RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutInterview.module.scss';

export function RecruitmentUsersWithoutInterview() {
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    getApplicantsWithoutInterviews('1').then((response) => {
      setUsers(response.data);
      setShowSpinner(false);
    });
  }, []);

  const tableColumns = [
    { content: t(KEY.common_username), sortable: true },
    { content: t(KEY.common_firstname), sortable: true },
    { content: t(KEY.common_lastname), sortable: true },
    { content: t(KEY.recruitment_number_of_applications), sortable: true },
  ];

  function filterUsers(): RecruitmentUserDto[] {
    if (searchQuery === '') return users;
    const keywords = searchQuery.split(' ');
    return users.filter((user) => {
      const fieldsToSearch = [user.username, user.first_name, user.last_name].join(' ').toLowerCase();
      for (const kw of keywords) {
        if (!fieldsToSearch.includes(kw.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }

  function userToTableRow(user: RecruitmentUserDto) {
    console.log(user.recruitment_application_ids);
    return [
      user.username,
      user.first_name,
      user.last_name,
      user.recruitment_application_ids ? user.recruitment_application_ids.length : 0,
    ];
  }

  return (
    <AdminPageLayout title={'Test'} backendUrl={ROUTES.backend.samfundet__user} header={'Test'} loading={showSpinner}>
      <InputField icon="mdi:search" onChange={setSearchQuery} />
      <div className={styles.table_container}>
        <Table columns={tableColumns} data={filterUsers().map((user) => userToTableRow(user))} />
      </div>
    </AdminPageLayout>
  );
}

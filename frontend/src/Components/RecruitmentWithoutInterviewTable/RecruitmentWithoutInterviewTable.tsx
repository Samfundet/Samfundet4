import styles from './RecruitmentWithoutInterviewTable.module.scss';
import { RecruitmentUserDto } from '~/dto';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Link } from '../Link';
import { ROUTES } from '~/routes';
import { InputField } from '../InputField';
import { dbT } from '~/utils';
import { Table } from '~/Components/Table';
import { WithoutInterviewModal } from './components';

type RecruitmentWithoutInterviewTableProps = {
  applicants: RecruitmentUserDto[];
};

export function RecruitmentWithoutInterviewTable({ applicants }: RecruitmentWithoutInterviewTableProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.recruitment_applicant_top_position), sortable: true },
    { content: t(KEY.recruitment_number_of_applications), sortable: true },
    { content: t(KEY.common_processed), sortable: true },
  ];

  function filterUsers(): RecruitmentUserDto[] {
    if (searchQuery === '') return applicants;
    const keywords = searchQuery.split(' ');
    return applicants.filter((user) => {
      const fieldsToSearch = [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.top_application.recruitment_position.name_nb,
        user.top_application.recruitment_position.name_en,
      ]
        .join(' ')
        .toLowerCase();
      for (const kw of keywords) {
        if (!fieldsToSearch.includes(kw.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }

  function userToTableRow(user: RecruitmentUserDto) {
    return [
      {
        value: user.first_name + ' ' + user.last_name,
        content: <Link url={ROUTES.frontend.recruitment_application}>{user.first_name + ' ' + user.last_name}</Link>,
      },
      user.email,
      user.phone_number,
      dbT(user.top_application.recruitment_position, 'name'),
      user.applications ? user.applications.length : 0,
      {
        value: user.applications_without_interview ? user.applications_without_interview.length : 0,
        content: (
          <WithoutInterviewModal
            applications_without_interview={user.applications_without_interview}
            applications={user.applications}
          />
        ),
      },
    ];
  }

  return (
    <div>
      <InputField icon="mdi:search" onChange={setSearchQuery} placeholder={t(KEY.common_search)} />
      <div className={styles.table_container}>
        <Table columns={tableColumns} data={filterUsers().map((user) => ({ cells: userToTableRow(user) }))} />
      </div>
    </div>
  );
}

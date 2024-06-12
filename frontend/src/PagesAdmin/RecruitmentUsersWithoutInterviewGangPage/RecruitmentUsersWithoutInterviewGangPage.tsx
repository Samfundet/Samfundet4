import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getApplicantsWithoutInterviews, getGang, getRecruitment } from '~/api';
import { RecruitmentDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutInterviewGangPage.module.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Text } from '~/Components/Text/Text';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { dbT } from '~/utils';
import { WithoutInterviewModal } from './components';
import { reverse } from '~/named-urls';

export function RecruitmentUsersWithoutInterviewGangPage() {
  const { recruitmentId, gangId } = useParams();
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [gang, setGang] = useState<RecruitmentDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  useEffect(() => {
    if (recruitmentId && gangId) {
      getApplicantsWithoutInterviews(recruitmentId, gangId)
        .then((response) => {
          setUsers(response.data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, gangId]);

  useEffect(() => {
    if (gangId) {
      getGang(gangId)
        .then((gang) => {
          setGang(gang);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_gangs });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangId]);

  useEffect(() => {
    if (recruitmentId) {
      getRecruitment(recruitmentId)
        .then((resp) => {
          setRecruitment(resp.data);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_recruitment });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.recruitment_applicant_top_position), sortable: true },
    { content: t(KEY.recruitment_number_of_applications), sortable: true },
    { content: t(KEY.common_processed), sortable: true },
  ];

  function filterUsers(): RecruitmentUserDto[] {
    if (searchQuery === '') return users;
    const keywords = searchQuery.split(' ');
    return users.filter((user) => {
      const fieldsToSearch = [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.top_admission.recruitment_position.name_nb,
        user.top_admission.recruitment_position.name_en,
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
      dbT(user.top_admission.recruitment_position, 'name'),
      user.admissions ? user.admissions.length : 0,
      {
        value: user.admissions_without_interview ? user.admissions_without_interview.length : 0,
        content: (
          <WithoutInterviewModal
            admissions_without_interview={user.admissions_without_interview}
            admissions={user.admissions}
          />
        ),
      },
    ];
  }
  const title = t(KEY.recruitment_applicants_without_interview);
  const header = (
    <div className={styles.header}>
      <Text as="strong" size="m" className={styles.headerBold}>
        {dbT(gang, 'name')} - {dbT(recruitment, 'name')}
      </Text>
      <Text>
        {users.length > 0
          ? t(KEY.recruitment_applicants_without_interview_help_text)
          : t(KEY.recruitment_not_applicants_without_interviews)}
      </Text>
    </div>
  );
  return (
    <AdminPageLayout title={title} backendUrl={ROUTES.backend.samfundet__user} header={header} loading={showSpinner}>
      <InputField icon="mdi:search" onChange={setSearchQuery} placeholder={t(KEY.common_search)} />
      <div className={styles.table_container}>
        <Table columns={tableColumns} data={filterUsers().map((user) => userToTableRow(user))} />
      </div>
    </AdminPageLayout>
  );
}

import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Link, Text } from '~/Components';
import { Table } from '~/Components/Table';
import type { RecruitmentApplicationDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './WithoutInterview.module.scss';

type WithoutInterviewListProps = {
  applications: RecruitmentApplicationDto[];
  user: RecruitmentUserDto;
  applicationsWithoutInterview: RecruitmentApplicationDto[];
};

export function WithoutInterviewList({ applications, user, applicationsWithoutInterview }: WithoutInterviewListProps) {
  const { t } = useTranslation();

  const tableColumns = [
    { content: t(KEY.recruitment_position), sortable: true },

    { content: t(KEY.recruitment_interview_planned), sortable: true },
    { content: t(KEY.recruitment_priority), sortable: true },
  ];

  function applicationToRow(application: RecruitmentApplicationDto) {
    const hasInterview = !applicationsWithoutInterview.some((app) => app.id === application.id);

    return {
      cells: [
        {
          value: dbT(application.recruitment_position, 'name'),
          content: (
            <Link
              url={reverse({
                pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
                urlParams: {
                  recruitmentId: application.recruitment,
                  gangId: application.recruitment_position.gang.id,
                  positionId: application.recruitment_position.id,
                },
              })}
            >
              {dbT(application.recruitment_position, 'name')}
            </Link>
          ),
        },

        {
          value: hasInterview ? 1 : 0,
          content: (
            <Icon
              icon={
                hasInterview
                  ? 'material-symbols:check-circle-outline-rounded'
                  : 'material-symbols:close-small-outline-rounded'
              }
            />
          ),
        },
        application.applicant_priority,
      ],
    };
  }

  return (
    <div className={styles.container}>
      <Text size="l">
        {user.first_name} {user.last_name}
      </Text>
      <Table columns={tableColumns} data={applications.map((application) => applicationToRow(application))} />
    </div>
  );
}

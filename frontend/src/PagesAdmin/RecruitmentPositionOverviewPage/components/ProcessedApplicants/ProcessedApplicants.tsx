import { RecruitmentApplicationDto } from '~/dto';
import styles from './ProcessedApplicants.module.scss';
import { Table } from '~/Components/Table';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { Link } from '~/Components';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

type ProcessedType = 'rejected' | 'withdrawn' | 'accepted';

type ProcessedApplicantsProps = {
  data: RecruitmentApplicationDto[];
  type: ProcessedType;
};

export function ProcessedApplicants({ data, type }: ProcessedApplicantsProps) {
  const { t } = useTranslation();
  const columns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
  ];

  const rows = data.map(function (application) {
    return [
      {
        value: application.user.first_name,
        content: (
          <Link
            key={application.user.id}
            target={'backend'}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_applicant,
              urlParams: {
                applicationID: application.id,
              },
            })}
          >
            {`${application.user.first_name} ${application.user.last_name}`}
          </Link>
        ),
      },
      { content: application.user?.phone_number, value: application.user?.phone_number },
      { content: application.user?.email, value: application.user?.email },
      { content: application.interview?.interview_time, value: application.interview?.interview_time },
      { content: application.interview?.interview_location, value: application.interview?.interview_location },
      { content: application.recruiter_status, value: application.recruiter_status },
    ];
  });

  const styleType = {
    withdrawn: styles.withdrawn,
    accepted: styles.accepted,
    rejected: styles.rejected,
  };

  return (
    <Table
      columns={columns}
      data={rows}
      bodyRowClassName={styleType[type]}
      headerClassName={styles.header}
      headerColumnClassName={styles.headerCol}
      cellClassName={styles.rowCell}
    />
  );
}

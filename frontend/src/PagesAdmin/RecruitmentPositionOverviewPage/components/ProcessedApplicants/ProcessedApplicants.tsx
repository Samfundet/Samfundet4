import { useTranslation } from 'react-i18next';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './ProcessedApplicants.module.scss';

type ProcessedType = 'rejected' | 'withdrawn' | 'accepted' | 'hardtoget';

type ProcessedApplicantsProps = {
  data: RecruitmentApplicationDto[];
  revertStateFunction?: (id: string, data: RecruitmentApplicationStateDto) => void;
  type: ProcessedType;
};

export function ProcessedApplicants({ data, type, revertStateFunction }: ProcessedApplicantsProps) {
  const { t } = useTranslation();
  const columns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
    revertStateFunction && { content: '', sortable: false },
  ];

  const rows = data.map((application) => ({
    cells: [
      {
        content: (
          <Link
            key={application.user.id}
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
      revertStateFunction && {
        content: (
          <Button
            display="pill"
            theme="outlined"
            onClick={() => revertStateFunction(application.id, { recruiter_status: 0 })}
          >
            {t(KEY.recruitment_revert_status)}
          </Button>
        ),
        value: application.recruiter_status,
      },
    ],
  }));

  const styleType = {
    withdrawn: styles.withdrawn,
    accepted: styles.accepted,
    rejected: styles.rejected,
    hardtoget: styles.hardtoget,
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

import { RecruitmentApplicationDto, RecruitmentAdmissionStateDto } from '~/dto';
import styles from './ProcessedApplicants.module.scss';
import { Table } from '~/Components/Table';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { Button, Link } from '~/Components';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

type ProcessedType = 'rejected' | 'withdrawn' | 'accepted';

type ProcessedApplicantsProps = {
  data: RecruitmentApplicationDto[];
  revertStateFunction?: (id: string, data: RecruitmentAdmissionStateDto) => void;
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

  const rows = data.map(function (application) {
    return [
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
        value: admission.user.first_name,
      },
      { content: admission.user?.phone_number, value: admission.user?.phone_number },
      { content: admission.user?.email, value: admission.user?.email },
      { content: admission.interview?.interview_time, value: admission.interview?.interview_time },
      { content: admission.interview?.interview_location, value: admission.interview?.interview_location },
      { content: admission.recruiter_status, value: admission.recruiter_status },
      revertStateFunction && {
        content: (
          <Button
            display="pill"
            theme="outlined"
            onClick={() => revertStateFunction(admission.id, { recruiter_status: 0 })}
          >
            {t(KEY.recruitment_revert_status)}
          </Button>
        ),
        value: admission.recruiter_status,
      },
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

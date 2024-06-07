import { RecruitmentAdmissionDto } from '~/dto';
import styles from './ProcessedApplicants.module.scss';
import { Table } from '~/Components/Table';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { Link } from '~/Components';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

type ProcessedType = 'rejected' | 'withdrawn' | 'accepted';

type ProcessedApplicantsProps = {
  data: RecruitmentAdmissionDto[];
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

  const rows = data.map(function (admission) {
    return [
      {
        value: admission.user.first_name,
        content: (
          <Link
            key={admission.user.id}
            target={'backend'}
            url={reverse({
              pattern: ROUTES.backend.admin__samfundet_recruitmentadmission_change,
              urlParams: {
                objectId: admission.id,
              },
            })}
          >
            {`${admission.user.first_name} ${admission.user.last_name}`}
          </Link>
        ),
      },
      { content: admission.user?.phone_number, value: admission.user?.phone_number },
      { content: admission.user?.email, value: admission.user?.email },
      { content: admission.interview.interview_time, value: admission.interview.interview_time },
      { content: admission.interview.interview_location, value: admission.interview.interview_location },
      { content: admission.recruiter_status, value: admission.recruiter_status },
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

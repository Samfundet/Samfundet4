import type { RecruitmentAdmissionDto } from '~/dto';
import styles from './WithoutInterview.module.scss';
import { Link } from '~/Components';
import { dbT } from '~/utils';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { Table } from '~/Components/Table';
import { reverse } from '~/named-urls';

type WithoutInterviewListProps = {
  admissions: RecruitmentAdmissionDto[];
};

export function WithoutInterviewList({ admissions }: WithoutInterviewListProps) {
  const { t } = useTranslation();

  const tableColumns = [
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_priority), sortable: true },
  ];

  function admissionToRow(admission: RecruitmentAdmissionDto) {
    return [
      {
        value: dbT(admission.recruitment_position, 'name'),
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_applicant,
              urlParams: {
                admissionID: admission.id,
              },
            })}
          >
            {dbT(admission.recruitment_position, 'name')}
          </Link>
        ),
      },
      admission.applicant_priority,
    ];
  }
  return (
    <div className={styles.container}>
      <Table columns={tableColumns} data={admissions.map((admission) => admissionToRow(admission))} />
    </div>
  );
}

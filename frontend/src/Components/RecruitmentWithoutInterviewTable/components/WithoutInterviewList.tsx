import { useTranslation } from 'react-i18next';
import { Link } from '~/Components';
import { Table } from '~/Components/Table';
import type { RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './WithoutInterview.module.scss';

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

import { RecruitmentAdmissionDto } from '~/dto';
import styles from './WithoutInterview.module.scss';
import { Link } from '~/Components';
import { dbT } from '~/utils';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { Table } from '~/Components/Table';

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
          <Link url={ROUTES.frontend.recruitment_application}>{dbT(admission.recruitment_position, 'name')}</Link>
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

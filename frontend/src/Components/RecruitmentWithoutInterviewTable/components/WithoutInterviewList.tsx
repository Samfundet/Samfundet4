import { useTranslation } from 'react-i18next';
import { Link } from '~/Components';
import { Table } from '~/Components/Table';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './WithoutInterview.module.scss';

type WithoutInterviewListProps = {
  applications: RecruitmentApplicationDto[];
};

export function WithoutInterviewList({ applications }: WithoutInterviewListProps) {
  const { t } = useTranslation();

  const tableColumns = [
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_priority), sortable: true },
  ];

  function applicationToRow(application: RecruitmentApplicationDto) {
    return [
      {
        value: dbT(application.recruitment_position, 'name'),
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_applicant,
              urlParams: {
                applicationID: application.id,
              },
            })}
          >
            {dbT(application.recruitment_position, 'name')}
          </Link>
        ),
      },
      application.applicant_priority,
    ];
  }
  return (
    <div className={styles.container}>
      <Table columns={tableColumns} data={applications.map((application) => applicationToRow(application))} />
    </div>
  );
}

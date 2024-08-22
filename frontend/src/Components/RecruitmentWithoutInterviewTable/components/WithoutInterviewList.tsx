import { RecruitmentApplicationDto } from '~/dto';
import styles from './WithoutInterview.module.scss';
import { Link } from '~/Components';
import { dbT } from '~/utils';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { Table } from '~/Components/Table';
import { reverse } from '~/named-urls';

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

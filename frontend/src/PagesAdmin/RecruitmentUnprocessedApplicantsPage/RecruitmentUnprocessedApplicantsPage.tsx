import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Table } from '~/Components';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

const data = [
  ['John Doe', 'High', 'john.doe@example.com', 'Frontend Developer', 'vil ha'],
  ['Jane Smith', 'Medium', 'jane.smith@example.com', 'Backend Developer', 'reservert'],
  ['Michael Johnson', 'Low', 'michael.johnson@example.com', 'Data Scientist', 'automatisk avslag'],
  ['Emily Davis', 'High', 'emily.davis@example.com', 'Full Stack Developer', 'ikke satt'],
  ['John Doe', 'Medium', 'john.doe@example.com', 'Project Manager', 'vil ha'],
  ['Chris Brown', 'Low', 'chris.brown@example.com', 'QA Engineer', 'reservert'],
];

export function RecruitmentUnprocessedApplicantsPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const title = t(KEY.recruitment_unprocessed_applicants);
  useTitle(title);

  // Count the total number of rows
  const totalRows = data.length;

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_priority), sortable: true, hideSortButton: false },
    { content: t(KEY.common_email), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_application), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: true, hideSortButton: false },
  ];

  const header = (
    <>
      <Button
        theme="success"
        rounded={true}
        link={reverse({
          pattern: ROUTES.frontend.admin_recruitment_gang_overview,
          urlParams: { recruitmentId: recruitmentId },
        })}
      >
        {t(KEY.common_go_back)}
      </Button>
      {/* Display the total number of applicants */}
      <p>
        {t(KEY.recruitment_applicants)}: {totalRows}
      </p>
    </>
  );

  return (
    <AdminPageLayout title={title} header={header}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}

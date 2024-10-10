import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link, Table } from '~/Components';
import { getRecruitmentUnprocessedApplicants } from '~/api';
import type { RecruitmentUnprocessedApplicationsDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { RecruitmentPriorityChoicesMapping, RecruitmentStatusChoicesMapping } from '~/types';
import { dbT } from '~/utils';
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
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const navigate = useNavigate();
  const [unprocessedApplicants, setUnprocessedApplicants] = useState<RecruitmentUnprocessedApplicationsDto[]>([]);

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentUnprocessedApplicants(recruitmentId)
        .then((res) => {
          setUnprocessedApplicants(res.data);
        })
        .then(() => {
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request?.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }, [recruitmentId, t, navigate]);

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_priority), sortable: true, hideSortButton: false },
    { content: t(KEY.common_email), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_position), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: true, hideSortButton: false },
  ];

  const data = unprocessedApplicants.map((unprocessedApplicant) => {
    const applicantUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_applicant,
      urlParams: { applicationID: unprocessedApplicant.id },
    });

    const positionUrl = reverse({
      pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
      urlParams: {
        recruitmentId: recruitmentId,
        gangId: unprocessedApplicant.recruitment_position.gang,
        positionId: unprocessedApplicant.recruitment_position.id,
      },
    });

    return [
      {
        content: (
          <Link url={applicantUrl}>
            {`${unprocessedApplicant.user.first_name} ${unprocessedApplicant.user.last_name}`}
          </Link>
        ),
      },
      {
        content: RecruitmentPriorityChoicesMapping[unprocessedApplicant.recruiter_priority],
        value: unprocessedApplicant.recruiter_priority,
      },
      { content: unprocessedApplicant.user.email, value: unprocessedApplicant.user.email },
      {
        content: <Link url={positionUrl}>{dbT(unprocessedApplicant.recruitment_position, 'name')}</Link>,
        value: dbT(unprocessedApplicant.recruitment_position, 'name'),
      },
      {
        content: RecruitmentStatusChoicesMapping[unprocessedApplicant.recruiter_status],
        value: unprocessedApplicant.recruiter_status,
      },
    ];
  });

  // Count the total number of rows
  const totalRows = data.length;

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

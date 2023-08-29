import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RecruitmentAdmissionDto } from '~/dto';
import { getRecruitmentAdmissionsForGang } from '~/api';
import { KEY } from '~/i18n/constants';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { ROUTES } from '~/routes';
import { reverse } from '~/named-urls';

export function RecruitmentPositionOverviewPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const positionId = useParams().positionId;
  const navigate = useNavigate();
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  useEffect(() => {
    recruitmentId &&
      gangId &&
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((data) => {
        setRecruitmentApplicants(
          data.data.filter(
            (recruitmentApplicant) => recruitmentApplicant.recruitment_position.toString() == positionId,
          ),
        );
        setShowSpinner(false);
      });
  }, [recruitmentId, gangId, positionId]);

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true },
    { content: t(KEY.recruitment_priority), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_priority), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
  ];
  const data = recruitmentApplicants.map(function (admission) {
    return [
      {
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
      { content: admission.priority },
      { content: admission.interview_time },
      { content: admission.interview_location },
      { content: admission.recruiter_priority },
      { content: admission.recruiter_status },
    ];
  });
  const title = t(KEY.admin_information_manage_title);
  const backendUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_recruitmentposition_change,
    urlParams: {
      objectId: positionId,
    },
  });

  const header = (
    <Button
      theme="success"
      rounded={true}
      onClick={() =>
        navigate(
          reverse({
            pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
            urlParams: {
              gangId: gangId,
              recruitmentId: recruitmentId,
            },
          }),
        )
      }
    >
      {t(KEY.common_go_back)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} />
    </AdminPageLayout>
  );
}

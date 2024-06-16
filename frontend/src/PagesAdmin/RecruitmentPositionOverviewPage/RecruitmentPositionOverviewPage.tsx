import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, RecruitmentApplicantsStatus } from '~/Components';

import { getRecruitmentAdmissionsForGang } from '~/api';
import { RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

// TODO: Fetch from backend

export function RecruitmentPositionOverviewPage() {
  const { recruitmentId, gangId, positionId } = useParams();
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  useEffect(() => {
    recruitmentId &&
      gangId &&
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((data) => {
        setRecruitmentApplicants(
          data.data.filter(
            (recruitmentApplicant) => recruitmentApplicant.recruitment_position?.toString() == positionId,
          ),
        );
        setShowSpinner(false);
      });
  }, [recruitmentId, gangId, positionId]);

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
      link={reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
        urlParams: {
          gangId: gangId,
          recruitmentId: recruitmentId,
        },
      })}
    >
      {t(KEY.common_go_back)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <RecruitmentApplicantsStatus
        applicants={recruitmentApplicants}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
      />
    </AdminPageLayout>
  );
}

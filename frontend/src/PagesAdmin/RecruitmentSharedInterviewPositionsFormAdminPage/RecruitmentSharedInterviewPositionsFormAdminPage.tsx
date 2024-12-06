import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRecruitmentSharedInterviewPositions } from '~/api';
import type { RecruitmentSharedInterviewPositionsDto, RecruitmentSharedInterviewPositionsPostDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { RecruitmentSharedInterviewPositionsForm } from './RecruitmentSharedInterviewPositionsForm';

export function RecruitmentSharedInterviewPositionsFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, sharedInterviewGroupId } = useParams();
  const [sharedInterview, setSharedInterview] = useState<Partial<RecruitmentSharedInterviewPositionsDto>>();

  useEffect(() => {
    if (sharedInterviewGroupId && recruitmentId) {
      getRecruitmentSharedInterviewPositions(sharedInterviewGroupId)
        .then((data) => {
          setSharedInterview(data.data);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId },
            }),
            { replace: true },
          );
        });
    }
  }, [sharedInterviewGroupId, recruitmentId, navigate, t]);

  const initialData: Partial<RecruitmentSharedInterviewPositionsPostDto> = {
    name_nb: sharedInterview?.name_nb || '',
    name_en: sharedInterview?.name_en || '',
    recruitment: recruitmentId,
    positions: sharedInterview?.positions?.map((pos) => pos.id) || [],
  };

  const title = sharedInterviewGroupId
    ? t(KEY.recruitment_interview_group_edit_header)
    : t(KEY.recruitment_interview_group_create_header);

  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <RecruitmentSharedInterviewPositionsForm
        initialData={initialData}
        sharedInterviewGroupId={sharedInterviewGroupId}
        recruitmentId={recruitmentId}
      />
    </AdminPageLayout>
  );
}

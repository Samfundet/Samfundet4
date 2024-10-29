import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRecruitmentSharedInterviewGroup } from '~/api';
import type { RecruitmentSharedInterviewGroupDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { RecruitmentInterviewGroupForm } from './RecruitmentInterviewGroupForm';
import { dbT } from '~/utils';

export function RecruitmentInterviewGroupFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, sharedInterviewGroupId } = useParams();
  const [sharedInterview, setSharedInterview] = useState<Partial<RecruitmentSharedInterviewGroupDto>>();

  useEffect(() => {
    if (sharedInterviewGroupId && recruitmentId) {
      getRecruitmentSharedInterviewGroup(sharedInterviewGroupId)
        .then((data) => {
          setSharedInterview(data.data);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId},
            }),
            { replace: true },
          );
        });
    }
  }, [sharedInterviewGroupId, recruitmentId, navigate, t]);

  const initialData: Partial<RecruitmentSharedInterviewGroupDto> = {
    name_nb: sharedInterview?.name_nb || '',
    name_en: sharedInterview?.name_en || '',
    recruitment: recruitmentId,
    positions: sharedInterview?.positions || []
  };

  const title = sharedInterviewGroupId
    ? `${t(KEY.common_edit)} ${dbT(sharedInterview, 'name')}`
    : `${t(KEY.common_create)} ${t(KEY.recruitment_interview_group)}`;

  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <RecruitmentInterviewGroupForm
        initialData={initialData}
        sharedInterviewGroupId={sharedInterviewGroupId}
        recruitmentId={recruitmentId}
      />
    </AdminPageLayout>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRecruitmentPosition } from '~/api';
import type { RecruitmentPositionDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { RecruitmentPositionForm } from './RecruitmentPositionForm';

export function RecruitmentPositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const [position, setPosition] = useState<Partial<RecruitmentPositionDto>>();
  const [norwegianApplicantsOnly, setNorwegianApplicantsOnly] = useState<boolean>(false);

  useEffect(() => {
    if (positionId) {
      getRecruitmentPosition(positionId)
        .then((data) => {
          setPosition(data.data);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
              urlParams: { recruitmentId, gangId },
            }),
            { replace: true },
          );
        });
    }
  }, [positionId, recruitmentId, gangId, navigate, t]);

  const initialData: Partial<RecruitmentPositionDto> = {
    name_nb: position?.name_nb || '',
    name_en: position?.name_en || '',
    norwegian_applicants_only: position?.norwegian_applicants_only || false,
    short_description_nb: position?.short_description_nb || '',
    short_description_en: position?.short_description_en || '',
    long_description_nb: position?.long_description_nb || '',
    long_description_en: position?.long_description_en || '',
    is_funksjonaer_position: position?.is_funksjonaer_position || false,
    default_application_letter_nb: position?.default_application_letter_nb || '',
    default_application_letter_en: position?.default_application_letter_en || '',
    tags: position?.tags || '',
  };

  const title = positionId
    ? `${t(KEY.common_edit)} ${position?.name_nb}`
    : `${t(KEY.common_create)} ${t(KEY.recruitment_position)}`;

  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <RecruitmentPositionForm
        initialData={initialData}
        positionId={positionId}
        recruitmentId={recruitmentId}
        gangId={gangId}
      />
    </AdminPageLayout>
  );
}

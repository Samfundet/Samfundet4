import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentSeparatePosition, postRecruitmentSeparatePosition, putRecruitmentSeparatePosition } from '~/api';
import type { RecruitmentSeparatePositionDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentSeparatePositionFormAdminPage.module.scss';

type FormType = {
  name_nb: string;
  name_en: string;

  description_nb: string;
  description_en: string;

  url: string;
};

export function RecruitmentSeparatePositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { recruitmentId, separatePositionId } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [separatePosition, setSeparatePosition] = useState<Partial<RecruitmentSeparatePositionDto>>();

  // Fetch data if edit mode.
  useEffect(() => {
    if (separatePositionId) {
      getRecruitmentSeparatePosition(separatePositionId)
        .then((response) => {
          setSeparatePosition(response.data);
          setShowSpinner(false);
        })
        .catch((response) => {
          if (response.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(
              reverse({
                pattern: ROUTES.frontend.admin_recruitment_gang_overview,
                urlParams: { recruitmentId: recruitmentId },
              }),
              { replace: true },
            );
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [separatePositionId, navigate, recruitmentId, t]);

  const initialData: Partial<RecruitmentSeparatePositionDto> = {
    name_nb: separatePosition?.name_nb,
    name_en: separatePosition?.name_en,
    description_nb: separatePosition?.description_nb,
    description_en: separatePosition?.description_en,
    url: separatePosition?.url,
    recruitment: separatePosition ? separatePosition?.recruitment : recruitmentId,
  };

  const submitText = separatePositionId ? t(KEY.common_save) : t(KEY.common_create);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: RecruitmentSeparatePositionDto) {
    const updatedPosition = data;
    if (separatePositionId) {
      // Update page.
      putRecruitmentSeparatePosition(separatePositionId, updatedPosition)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      // Post new page.
      postRecruitmentSeparatePosition(updatedPosition)
        .then(() => {
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }
  return (
    <>
      <AdminPageLayout title={`${t(KEY.common_create)} ${t(KEY.recruitment_position)}`} header={true}>
        <div className={styles.wrapper}>
          <SamfForm<FormType> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
            <div className={styles.row}>
              <SamfFormField<string, FormType>
                field="name_nb"
                type="text"
                label={`${t(KEY.common_name)} ${t(KEY.common_norwegian)}`}
                required={true}
              />
              <SamfFormField<string, FormType>
                field="name_en"
                type="text"
                required={true}
                label={`${t(KEY.common_name)} ${t(KEY.common_english)}`}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<string, FormType>
                field="description_nb"
                type="text_long"
                label={`${t(KEY.common_short_description)} ${t(KEY.common_norwegian)}`}
                required={true}
              />
              <SamfFormField<string, FormType>
                field="description_en"
                required={true}
                type="text_long"
                label={`${t(KEY.common_short_description)} ${t(KEY.common_english)}`}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<string, FormType> field="url" type="text" label={t(KEY.common_url)} required={true} />
            </div>
          </SamfForm>
        </div>
      </AdminPageLayout>
    </>
  );
}

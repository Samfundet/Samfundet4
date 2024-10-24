import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentPosition, postRecruitmentPosition, putRecruitmentPosition } from '~/api';
import type { RecruitmentPositionDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionFormAdminPage.module.scss';

type FormType = {
  name_nb: string;
  name_en: string;

  norwegian_applicants_only: boolean;

  short_description_nb: string;
  short_description_en: string;

  long_description_nb: string;
  long_description_en: string;

  is_funksjonaer_position: boolean;

  default_application_letter_nb: string;
  default_application_letter_en: string;

  tags: string;
};

export function RecruitmentPositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { recruitmentId, gangId, positionId } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [position, setPosition] = useState<Partial<RecruitmentPositionDto>>();
  const [norwegianApplicantsOnly, setNorwegianApplicantsOnly] = useState<boolean>(false);
  const title = `${t(KEY.common_create)} ${t(KEY.recruitment_position)}`;
  useTitle(title);

  // Fetch data if edit mode.
  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (positionId) {
      getRecruitmentPosition(positionId)
        .then((data) => {
          setPosition(data.data);
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(
              reverse({
                pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
                urlParams: { recruitmentId: recruitmentId, gangId: gangId },
              }),
              { replace: true },
            );
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [positionId]);

  const initialData: Partial<RecruitmentPositionDto> = {
    name_nb: position?.name_nb,
    name_en: position?.name_en,

    short_description_nb: position?.short_description_nb,
    short_description_en: position?.short_description_en,

    long_description_nb: position?.long_description_nb,
    long_description_en: position?.long_description_en,

    norwegian_applicants_only: position?.norwegian_applicants_only || false,

    default_application_letter_nb: position?.default_application_letter_nb,
    default_application_letter_en: position?.default_application_letter_en,
    is_funksjonaer_position: position?.is_funksjonaer_position || false,

    tags: position?.tags,
    // TODO: Add necessary fields to form.
    // gang: gangId,
    // recruitment: recruitmentId,
    // interviewers: position?.interviewers,
  };

  const submitText = positionId ? t(KEY.common_save) : t(KEY.common_create);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: RecruitmentPositionDto) {
    const updatedPosition = data;
    updatedPosition.gang.id = Number.parseInt(gangId ?? '');
    updatedPosition.recruitment = recruitmentId ?? '';
    updatedPosition.interviewers = [];
    if (positionId) {
      // Update page.

      putRecruitmentPosition(positionId, updatedPosition)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
              urlParams: { recruitmentId: recruitmentId, gangId: gangId },
            }),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      // Post new page.
      postRecruitmentPosition(updatedPosition)
        .then(() => {
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
              urlParams: { recruitmentId: recruitmentId, gangId: gangId },
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
      <AdminPageLayout title={title} header={true}>
        <div className={styles.wrapper}>
          <SamfForm<FormType> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
            <div className={styles.row}>
              <SamfFormField<boolean, FormType>
                field="norwegian_applicants_only"
                type="checkbox"
                label={`${t(KEY.recruitment_norwegian_applicants_only)}?`}
                onChange={() => {
                  setNorwegianApplicantsOnly(!norwegianApplicantsOnly);
                }}
                required={true}
              />
            </div>
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
                required={!norwegianApplicantsOnly}
                label={`${t(KEY.common_name)} ${t(KEY.common_english)}`}
              />
            </div>

            <div className={styles.row}>
              <SamfFormField<string, FormType>
                field="short_description_nb"
                type="text"
                label={`${t(KEY.common_short_description)} ${t(KEY.common_norwegian)}`}
                required={true}
              />
              <SamfFormField<string, FormType>
                field="short_description_en"
                required={!norwegianApplicantsOnly}
                type="text"
                label={`${t(KEY.common_short_description)} ${t(KEY.common_english)}`}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<string, FormType>
                field="long_description_nb"
                type="text_long"
                label={`${t(KEY.common_long_description)} ${t(KEY.common_norwegian)}`}
                required={true}
              />
              <SamfFormField<string, FormType>
                field="long_description_en"
                type="text_long"
                required={!norwegianApplicantsOnly}
                label={`${t(KEY.common_long_description)} ${t(KEY.common_english)}`}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<boolean, FormType>
                field="is_funksjonaer_position"
                type="checkbox"
                label={`${t(KEY.recruitment_funksjonaer)}?`}
                required={true}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<string, FormType>
                field="default_application_letter_nb"
                type="text_long"
                label={`${t(KEY.recrutment_default_application_letter)} ${t(KEY.common_norwegian)}`}
                required={true}
              />
              <SamfFormField<string, FormType>
                field="default_application_letter_en"
                type="text_long"
                label={`${t(KEY.recrutment_default_application_letter)} ${t(KEY.common_english)}`}
                required={!norwegianApplicantsOnly}
              />
            </div>
            <div className={styles.row}>
              <SamfFormField<string, FormType> field="tags" type="text" label={t(KEY.common_tags) ?? ''} />
            </div>
          </SamfForm>
        </div>
      </AdminPageLayout>
    </>
  );
}

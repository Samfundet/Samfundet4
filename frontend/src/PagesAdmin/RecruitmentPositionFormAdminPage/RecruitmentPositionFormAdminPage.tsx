import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getRecruitmentPosition, postRecruitmentPosition, putRecruitmentPosition } from '~/api';
import { RecruitmentPositionDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './RecruitmentPositionFormAdminPage.module.scss';

export function RecruitmentPositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { recruitmentId, gangId, positionId } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [position, setPosition] = useState<Partial<RecruitmentPositionDto>>({
    name_nb: 'Ny stilling',
    name_en: 'New position',
  });

  // Fetch data if edit mode.
  useEffect(() => {
    if (positionId) {
      getRecruitmentPosition(positionId)
        .then((data) => {
          setPosition(data.data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_recruitment);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionId]);

  const initialData: Partial<RecruitmentPositionDto> = {
    name_nb: position?.name_nb,
    name_en: position?.name_en,

    short_description_nb: position?.short_description_nb,
    short_description_en: position?.short_description_en,

    long_description_nb: position?.long_description_nb,
    long_description_en: position?.long_description_en,

    default_admission_letter_nb: position?.default_admission_letter_nb,
    default_admission_letter_en: position?.default_admission_letter_en,
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
    updatedPosition.gang = gangId ?? '';
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
    <div className={styles.wrapper}>
      <SamfForm<RecruitmentPositionDto> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField field="name_nb" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)} />
          <SamfFormField field="name_en" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_english)} />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="short_description_nb"
            type="text"
            label={t(KEY.common_short_description) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="short_description_en"
            type="text"
            label={t(KEY.common_short_description) + ' ' + t(KEY.common_english)}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="long_description_nb"
            type="text-long"
            label={t(KEY.common_long_description) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="long_description_en"
            type="text-long"
            label={t(KEY.common_long_description) + ' ' + t(KEY.common_english)}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField field="is_funksjonaer_position" type="checkbox" label={t(KEY.recruitment_funksjonaer) + '?'} />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="default_admission_letter_nb"
            type="text-long"
            label={t(KEY.recrutment_default_admission_letter) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="default_admission_letter_en"
            type="text-long"
            label={t(KEY.recrutment_default_admission_letter) + ' ' + t(KEY.common_english)}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField field="tags" type="text" label={t(KEY.common_tags) ?? ''} />
        </div>
      </SamfForm>
    </div>
  );
}

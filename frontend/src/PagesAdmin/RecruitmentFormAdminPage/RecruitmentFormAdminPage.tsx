import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfError, SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getOrganizations, postRecruitment, putRecruitment } from '~/api';
import { OrganizationDto, RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { useTitle } from '~/hooks';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { dbT, lowerCapitalize, utcTimestampToLocal } from '~/utils';
import styles from './RecruitmentFormAdminPage.module.scss';
import type { RecruitmentLoader } from '~/router/loaders';

type FormType = {
  name_nb: string;
  name_en: string;
  visible_from: string;
  shown_application_deadline: string;
  actual_application_deadline: string;
  reprioritization_deadline_for_applicant: string;
  reprioritization_deadline_for_groups: string;
  organization: number;
  promo_media: string;
};

function youtubeLinkValidator(state: FormType): SamfError {
  const link = state.promo_media;
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/;
  if (link && !link.match(regex)) {
    return 'Not valid youtbue link';
  }
  return true;
}

export function RecruitmentFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;

  // Form data
  const { recruitmentId } = useParams();
  const [organizationOptions, setOrganizationOptions] = useState<DropDownOption<number>[]>([]);

  useEffect(() => {
    // Fetch organizations.
    getOrganizations().then((data) => {
      const organizations = data.map((organization: OrganizationDto) => ({
        label: organization.name,
        value: organization.id,
      }));
      setOrganizationOptions(organizations);
    });
  }, []);

  const initialData: Partial<FormType> = {
    name_nb: data?.recruitment?.name_nb,
    name_en: data?.recruitment?.name_en,
    visible_from: utcTimestampToLocal(data?.recruitment?.visible_from),
    actual_application_deadline: utcTimestampToLocal(data?.recruitment?.actual_application_deadline),
    shown_application_deadline: utcTimestampToLocal(data?.recruitment?.shown_application_deadline),
    reprioritization_deadline_for_applicant: utcTimestampToLocal(
      data?.recruitment?.reprioritization_deadline_for_applicant,
    ),
    reprioritization_deadline_for_groups: utcTimestampToLocal(data?.recruitment?.reprioritization_deadline_for_groups),
    organization: data?.recruitment?.organization,
  };

  const title = recruitmentId
    ? `${t(KEY.common_edit)} ${dbT(data?.recruitment, 'name')}`
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_recruitment)}`);

  useTitle(title);

  const submitText = recruitmentId ? t(KEY.common_save) : t(KEY.common_create);

  function handleOnSubmit(data: FormType) {
    if (recruitmentId) {
      // Update page.
      putRecruitment(recruitmentId, data as RecruitmentDto)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
      navigate(ROUTES.frontend.admin_recruitment);
    } else {
      // Post new page.
      postRecruitment(data as RecruitmentDto)
        .then(() => {
          navigate(ROUTES.frontend.admin_recruitment);
          toast.success(t(KEY.common_creation_successful));
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }

  // TODO: Add validation for the dates
  return (
    <AdminPageLayout title={title} header={true}>
      <div className={styles.wrapper}>
        <SamfForm<FormType>
          onSubmit={handleOnSubmit}
          initialData={initialData}
          submitText={submitText}
          validateOn={'submit'}
        >
          <div className={styles.row}>
            <SamfFormField<string, FormType>
              field="name_nb"
              type="text"
              label={t(KEY.common_name) + ' ' + t(KEY.common_english)}
              required={true}
            />
            <SamfFormField<string, FormType>
              field="name_en"
              type="text"
              label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)}
              required={true}
            />
          </div>
          <div className={styles.row}>
            <SamfFormField
              field="visible_from"
              type="date_time"
              label={t(KEY.recruitment_visible_from) ?? ''}
              required={true}
            />
          </div>
          <div className={styles.row}>
            <SamfFormField
              field="shown_application_deadline"
              type="date_time"
              label={t(KEY.shown_application_deadline) ?? ''}
              required={true}
            />
            <SamfFormField
              field="actual_application_deadline"
              type="date_time"
              label={t(KEY.actual_application_deadlin) ?? ''}
              required={true}
            />
          </div>
          <div className={styles.row}>
            <SamfFormField
              field="reprioritization_deadline_for_applicant"
              type="date_time"
              label={t(KEY.reprioritization_deadline_for_applicant) ?? ''}
              required={true}
            />
            <SamfFormField
              field="reprioritization_deadline_for_groups"
              type="date_time"
              label={t(KEY.reprioritization_deadline_for_groups) ?? ''}
              required={true}
            />
          </div>
          <div className={styles.row}>
            <SamfFormField field="max_applications" type="number" label={t(KEY.max_applications) ?? ''} />
            <SamfFormField
              field="organization"
              type="options"
              label={t(KEY.recruitment_organization) ?? ''}
              options={organizationOptions}
              required={true}
            />
          </div>
          <div className={styles.row}>
            <SamfFormField
              field="promo_media"
              type="text"
              label={t(KEY.promo_media)}
              validator={youtubeLinkValidator}
            />
          </div>
        </SamfForm>
      </div>
    </AdminPageLayout>
  );
}

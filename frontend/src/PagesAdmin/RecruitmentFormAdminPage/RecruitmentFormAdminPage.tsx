import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getOrganizations, getRecruitment, postRecruitment, putRecruitment } from '~/api';
import type { OrganizationDto, RecruitmentDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { utcTimestampToLocal } from '~/utils';
import styles from './RecruitmentFormAdminPage.module.scss';

type FormType = {
  name_nb: string;
  name_en: string;
  visible_from: string;
  shown_application_deadline: string;
  actual_application_deadline: string;
  reprioritization_deadline_for_applicant: string;
  reprioritization_deadline_for_groups: string;
  organization: string;
};

export function RecruitmentFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [organizationOptions, setOrganizationOptions] = useState<DropDownOption<number>[]>([]);
  const [recruitment, setRecruitment] = useState<Partial<RecruitmentDto>>();

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

  // Fetch data if edit mode.
  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (id) {
      getRecruitment(id)
        .then((data) => {
          setRecruitment(data.data);
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
  }, [id]);

  const initialData: Partial<FormType> = {
    name_nb: recruitment?.name_nb,
    name_en: recruitment?.name_en,
    visible_from: utcTimestampToLocal(recruitment?.visible_from),
    actual_application_deadline: utcTimestampToLocal(recruitment?.actual_application_deadline),
    shown_application_deadline: utcTimestampToLocal(recruitment?.shown_application_deadline),
    reprioritization_deadline_for_applicant: utcTimestampToLocal(recruitment?.reprioritization_deadline_for_applicant),
    reprioritization_deadline_for_groups: utcTimestampToLocal(recruitment?.reprioritization_deadline_for_groups),
    organization: recruitment?.organization,
  };

  const submitText = id ? t(KEY.common_save) : t(KEY.common_create);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: FormType) {
    if (id) {
      // Update page.
      putRecruitment(id, data as RecruitmentDto)
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
    <AdminPageLayout title={`${t(KEY.common_create)} ${t(KEY.common_recruitment)}`} header={true} showBackButton={true}>
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
              label={`${t(KEY.common_name)} ${t(KEY.common_english)}`}
              required={true}
            />
            <SamfFormField<string, FormType>
              field="name_en"
              type="text"
              label={`${t(KEY.common_name)} ${t(KEY.common_norwegian)}`}
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
            <SamfFormField field="max_admissions" type="number" label={t(KEY.max_admissions) ?? ''} />
            <SamfFormField
              field="organization"
              type="options"
              label={t(KEY.recruitment_organization) ?? ''}
              options={organizationOptions}
              required={true}
            />
          </div>
        </SamfForm>
      </div>
    </AdminPageLayout>
  );
}

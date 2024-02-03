import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getOrganizations, getRecruitment, postRecruitment, putRecruitment } from '~/api';
import { OrganizationDto, RecruitmentDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { utcTimestampToLocal } from '~/utils';
import styles from './RecruitmentFormAdminPage.module.scss';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { reverse } from '~/named-urls';

export function RecruitmentFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [organizationOptions, setOrganizationOptions] = useState<DropDownOption<number>[]>([]);
  const [recruitment, setRecruitment] = useState<Partial<RecruitmentDto>>({
    name_nb: 'Nytt opptak',
    name_en: 'New recruitment',
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialData: Partial<RecruitmentDto> = {
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

  const title = (id ? t(KEY.common_edit) : t(KEY.common_create)) + ' ' + t(KEY.common_recruitment);
  const backendUrl = id
    ? reverse({
        pattern: ROUTES.backend.admin__samfundet_recruitment_change,
        urlParams: {
          objectId: id,
        },
      })
    : ROUTES.backend.admin__samfundet_recruitment_add;

  function handleOnSubmit(data: RecruitmentDto) {
    if (id) {
      // Update page.
      putRecruitment(id, data)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
      navigate(ROUTES.frontend.admin_recruitment);
    } else {
      // Post new page.
      postRecruitment(data)
        .then(() => {
          navigate(ROUTES.frontend.admin_recruitment);
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  // TODO: Add validation for the dates
  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} loading={showSpinner}>
      <SamfForm<RecruitmentDto> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField field="name_nb" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_english)} />
          <SamfFormField field="name_en" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)} />
        </div>
        <div className={styles.row}>
          <SamfFormField field="visible_from" type="datetime" label={t(KEY.recruitment_visible_from) ?? ''} />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="shown_application_deadline"
            type="datetime"
            label={t(KEY.shown_application_deadline) ?? ''}
          />
          <SamfFormField
            field="actual_application_deadline"
            type="datetime"
            label={t(KEY.actual_application_deadlin) ?? ''}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="reprioritization_deadline_for_applicant"
            type="datetime"
            label={t(KEY.reprioritization_deadline_for_applicant) ?? ''}
          />
          <SamfFormField
            field="reprioritization_deadline_for_groups"
            type="datetime"
            label={t(KEY.reprioritization_deadline_for_groups) ?? ''}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="organization"
            type="options"
            label={t(KEY.recruitment_organization) ?? ''}
            options={organizationOptions}
          />
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}

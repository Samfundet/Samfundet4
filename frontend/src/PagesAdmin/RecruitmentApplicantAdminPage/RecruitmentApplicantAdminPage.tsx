import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BackButton, SamfundetLogoSpinner } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentApplicationsForRecruiter } from '~/api';
import type { InterviewDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './RecruitmentApplicantAdminPage.module.scss';
import {
  RecruitmentApplicantAllApplications,
  RecruitmentApplicantInfo,
  RecruitmentApplicantWithdraw,
  RecruitmentInterviewNotesForm,
} from './components';

export function RecruitmentApplicantAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applicationID } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recruitmentapplicationpage', applicationID],
    queryFn: () => getRecruitmentApplicationsForRecruiter(applicationID as string),
  });

  if (error) {
    if (data?.request.status === STATUS.HTTP_404_NOT_FOUND) {
      navigate(ROUTES.frontend.not_found, { replace: true });
    }
    toast.error(t(KEY.common_something_went_wrong));
  }

  const recruitmentApplication = data?.data.application;
  const applicant = data?.data.user;
  const interviewNotes = recruitmentApplication?.interview?.notes;

  if (isLoading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const initialData: Partial<InterviewDto> = {
    notes: interviewNotes || '',
  };

  return (
    <AdminPage title={`${applicant?.first_name} ${applicant?.last_name}`}>
      <div className={classNames(styles.infoContainer)}>
        <BackButton />
        <RecruitmentApplicantInfo applicant={data?.data.user} />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_application)}: {dbT(recruitmentApplication?.recruitment_position, 'name')}
        </Text>
        <Text>{recruitmentApplication?.application_text}</Text>
      </div>
      <div className={styles.withdrawContainer}>
        <RecruitmentApplicantWithdraw application={data?.data.application} />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <RecruitmentInterviewNotesForm initialData={initialData} />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_applications)} {t(KEY.common_in)}{' '}
          {dbT(data?.data.application.recruitment_position.gang, 'name')}
        </Text>
        <RecruitmentApplicantAllApplications applications={data?.data.other_applications} />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_all_applications)}
        </Text>
        <RecruitmentApplicantAllApplications applications={data?.data.other_applications} />
      </div>
    </AdminPage>
  );
}

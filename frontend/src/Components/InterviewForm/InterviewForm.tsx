import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { setRecruitmentApplicationInterview } from '~/api';
import type { InterviewDto, RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import { Text } from '../Text/Text';
import styles from './InterviewForm.module.scss';

type InterviewFormProps = {
  application: RecruitmentApplicationDto;
};

type FormType = {
  interview_time: string;
  interview_location: string;
};

export function InterviewForm({ application }: InterviewFormProps) {
  const { t } = useTranslation();

  function handleOnSubmit(data: InterviewDto) {
    setRecruitmentApplicationInterview(application.id, data)
      .then(() => {
        toast.success(t(KEY.common_update_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  const initialData: Partial<InterviewDto> = {
    interview_location: application?.interview?.interview_location,
    interview_time: application?.interview?.interview_time,
  };

  return (
    <div className={styles.container}>
      <Text size="l" as="strong">
        {t(KEY.recruitment_interview_set)}
      </Text>
      <Text>
        {t(KEY.recruitment_applicant)}: {application.user.first_name} {application.user.last_name}
      </Text>
      <Text>
        {t(KEY.recruitment_position)}: {dbT(application.recruitment_position, 'name')}
      </Text>
      <SamfForm<FormType> onSubmit={handleOnSubmit} initialData={initialData}>
        <div className={styles.row}>
          <SamfFormField field="interview_time" type="date_time" label={t(KEY.recruitment_interview_time)} />
        </div>
        <div className={styles.row}>
          <SamfFormField field="interview_location" type="text" label={t(KEY.recruitment_interview_location)} />
        </div>
      </SamfForm>
    </div>
  );
}

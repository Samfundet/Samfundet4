import { useEffect, useState } from 'react';
import { InterviewDto, RecruitmentAdmissionDto } from '~/dto';
import styles from './InterviewForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { setRecruitmentAdmissionsInterview } from '~/api';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Icon } from '@iconify/react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { Text } from '../Text/Text';
import { dbT } from '~/utils';

type InterviewFormProps = {
  admission: RecruitmentAdmissionDto;
};

export function InterviewForm({ admission }: InterviewFormProps) {
  const { t } = useTranslation();
  const [interviewData, setInterviewData] = useState<InterviewDto>();

  useEffect(() => {
    setInterviewData(admission?.interview);
    console.log(admission);
  }, [admission]);

  useEffect(() => {
    console.log(interviewData);
  }, [interviewData]);

  function handleOnSubmit(data: InterviewDto) {
    setRecruitmentAdmissionsInterview(admission.id, data)
      .then(() => {
        toast.success(t(KEY.common_update_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <Text size="l" as="strong">
        {t(KEY.recruitment_interview_set)}
      </Text>
      <Text>
        {t(KEY.recruitment_applicant)}: {admission.user.first_name} {admission.user.last_name}
      </Text>
      <Text>
        {t(KEY.recruitment_position)}: {dbT(admission.recruitment_position, 'name')}
      </Text>
      <SamfForm<InterviewDto> onSubmit={handleOnSubmit} initialData={interviewData ? interviewData : {}}>
        <div className={styles.row}>
          <SamfFormField field="interview_time" type="datetime" label={t(KEY.recruitment_interview_time)} />
        </div>
        <div className={styles.row}>
          <SamfFormField field="interview_location" type="text" label={t(KEY.recruitment_interview_location)} />
        </div>
      </SamfForm>
    </div>
  );
}

import { useState } from 'react';
import styles from './InterviewForm.module.scss';
import { Modal } from '../Modal';
import { IconButton } from '../IconButton';
import { InterviewForm } from './InterviewForm';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { RecruitmentApplicationDto } from '~/dto';

type InterviewFormModalProps = {
  application: RecruitmentApplicationDto;
};

export function InterviewFormModal({ application }: InterviewFormModalProps) {
  const { t } = useTranslation();
  const [interviewModal, setInterviewModal] = useState(false);

  return (
    <>
      <Button theme="samf" onClick={() => setInterviewModal(true)}>
        {t(KEY.recruitment_interview_set)}
      </Button>
      <Modal isOpen={interviewModal}>
        <>
          <IconButton
            title="close"
            className={styles.close}
            icon="mdi:close"
            onClick={() => setInterviewModal(false)}
          />
          <InterviewForm application={application} />
        </>
      </Modal>
    </>
  );
}

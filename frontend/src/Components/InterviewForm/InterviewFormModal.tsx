import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Modal } from '../Modal';
import { InterviewForm } from './InterviewForm';
import styles from './InterviewForm.module.scss';

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

import { useState } from 'react';
import styles from './WithoutInterview.module.scss';
import { WithoutInterviewList } from './WithoutInterviewList';
import type { RecruitmentAdmissionDto } from '~/dto';
import { Button, IconButton, Modal } from '~/Components';

type WithoutInterviewModalProps = {
  admissions: RecruitmentAdmissionDto[];
  admissions_without_interview: RecruitmentAdmissionDto[];
};

export function WithoutInterviewModal({ admissions, admissions_without_interview }: WithoutInterviewModalProps) {
  const [withoutInterviewModal, setWithoutInterviewModal] = useState(false);

  return (
    <>
      <Button theme="text" onClick={() => setWithoutInterviewModal(true)}>
        {admissions.length - admissions_without_interview.length} / {admissions.length}
      </Button>
      <Modal isOpen={withoutInterviewModal}>
        <IconButton
          title="close"
          className={styles.close}
          icon="mdi:close"
          onClick={() => setWithoutInterviewModal(false)}
        />
        <WithoutInterviewList admissions={admissions_without_interview} />
      </Modal>
    </>
  );
}

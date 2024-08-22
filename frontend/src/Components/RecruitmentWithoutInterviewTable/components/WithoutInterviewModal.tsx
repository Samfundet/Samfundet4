import { useState } from 'react';
import styles from './WithoutInterview.module.scss';
import { WithoutInterviewList } from './WithoutInterviewList';
import { RecruitmentApplicationDto } from '~/dto';
import { Button, IconButton, Modal } from '~/Components';

type WithoutInterviewModalProps = {
  applications: RecruitmentApplicationDto[];
  applications_without_interview: RecruitmentApplicationDto[];
};

export function WithoutInterviewModal({ applications, applications_without_interview }: WithoutInterviewModalProps) {
  const [withoutInterviewModal, setWithoutInterviewModal] = useState(false);

  return (
    <>
      <Button theme="text" onClick={() => setWithoutInterviewModal(true)}>
        {applications.length - applications_without_interview.length} / {applications.length}
      </Button>
      <Modal isOpen={withoutInterviewModal}>
        <IconButton
          title="close"
          className={styles.close}
          icon="mdi:close"
          onClick={() => setWithoutInterviewModal(false)}
        ></IconButton>
        <WithoutInterviewList applications={applications_without_interview} />
      </Modal>
    </>
  );
}

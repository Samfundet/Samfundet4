import { useState } from 'react';
import { Button, IconButton, Modal } from '~/Components';
import type { RecruitmentApplicationDto, RecruitmentUserDto } from '~/dto';
import styles from './WithoutInterview.module.scss';
import { WithoutInterviewList } from './WithoutInterviewList';

type WithoutInterviewModalProps = {
  user: RecruitmentUserDto;
  applications: RecruitmentApplicationDto[];
  applicationsWithoutInterview: RecruitmentApplicationDto[];
};

export function WithoutInterviewModal({
  applications,
  applicationsWithoutInterview,
  user,
}: WithoutInterviewModalProps) {
  const [withoutInterviewModal, setWithoutInterviewModal] = useState(false);

  return (
    <>
      <Button theme="outlined" display="pill" onClick={() => setWithoutInterviewModal(true)}>
        {applications.length - applicationsWithoutInterview.length} / {applications.length}
      </Button>
      <Modal isOpen={withoutInterviewModal}>
        <IconButton
          title="close"
          className={styles.close}
          icon="mdi:close"
          onClick={() => setWithoutInterviewModal(false)}
        />

        <WithoutInterviewList
          applicationsWithoutInterview={applicationsWithoutInterview}
          user={user}
          applications={applications}
        />
      </Modal>
    </>
  );
}

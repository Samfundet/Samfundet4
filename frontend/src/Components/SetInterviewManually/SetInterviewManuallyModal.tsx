import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { Modal } from '../Modal';
import styles from './SetInterviewManually.module.scss';
import { SetInterviewManuallyForm } from './SetInterviewManuallyForm';
import { RecruitmentApplicationDto } from '~/dto';
import { use } from 'i18next';
import { on } from 'events';

type SetInterviewManuallyModalProps = {
  recruitmentId: number;
  isButtonRounded?: boolean;
  application: RecruitmentApplicationDto;
  onSetInterview: () => void;
};

export function SetInterviewManuallyModal({
  recruitmentId = 1,
  isButtonRounded = false,
  application,
  onSetInterview,
}: SetInterviewManuallyModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button theme="samf" rounded={isButtonRounded} onClick={() => setOpen(true)}>
        {t(KEY.recruitment_interview_set)}
      </Button>

      <Modal isOpen={open} className={styles.occupied_modal}>
        <>
          <button className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
            <Icon icon="octicon:x-24" width={24} />
          </button>
          <SetInterviewManuallyForm
            recruitmentId={recruitmentId}
            onCancel={() => setOpen(false)}
            application={application}
            onSave={onSetInterview}
          ></SetInterviewManuallyForm>
        </>
      </Modal>
    </>
  );
}

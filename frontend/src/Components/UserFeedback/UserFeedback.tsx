import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { H4, IconButton, Modal } from '~/Components';
import { UserFeedbackForm } from '~/Components/UserFeedback/UserFeedbackForm';
import { KEY } from '~/i18n/constants';
import styles from './UserFeedback.module.scss';

export function UserFeedback() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {!isOpen && (
        <IconButton
          color="orange"
          className={styles.feedback_button}
          title="Feedback"
          icon="mdi:feedback-outline"
          onClick={() => setIsOpen(true)}
        />
      )}
      <Modal isOpen={isOpen} className={styles.modal}>
        <IconButton
          className={styles.modal_close_button}
          title="Close"
          icon="mdi:plus"
          height="35"
          onClick={() => setIsOpen(false)}
          avatarColor="red"
        />

        <H4 className={styles.heading}>{t(KEY.feedback_type_heading)}</H4>
        <UserFeedbackForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
}

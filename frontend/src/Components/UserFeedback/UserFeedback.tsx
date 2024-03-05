import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { IconButton, Modal } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { postFeedback } from '~/api';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './UserFeedback.module.scss';

type UserFeedbackProps = {
  enabled: boolean;
};

export function UserFeedback({ enabled }: UserFeedbackProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) {
    return <div></div>;
  }

  const handleFormSubmit = (formData: Record<string, string>) => {
    postFeedback({
      text: formData['feedback_text'],
      screen_resolution: window.innerWidth + 'x' + window.innerHeight,
      path: window.location.pathname,
      contact_email: formData['feedback_email'],
    })
      .then(() => setIsOpen(false))
      .catch((e) => {
        console.error(e);
        toast.error(t(KEY.common_something_went_wrong));
      });
  };

  const ModalContent = () => {
    return (
      <SamfForm onSubmit={handleFormSubmit} isDisabled={!isOpen} submitText={t(KEY.common_send)}>
        <h1>
          <b>{t(KEY.feedback_type_heading)}</b>
        </h1>
        <br />
        <p>{useTextItem(TextItem.feedback_helper_text)}</p>
        <SamfFormField field={'feedback_text'} type={'text-long'} label={t(KEY.feedback_your_feedback)} />
        <p>{useTextItem(TextItem.feedback_want_contact_text)}</p>
        <SamfFormField
          field={'feedback_email'}
          type={'email'}
          required={false}
          label={t(KEY.common_email) + ' (' + t(KEY.common_not_required) + ')'}
        />
      </SamfForm>
    );
  };

  return (
    <div>
      {!isOpen && (
        <IconButton
          color={'orange'}
          className={styles.feedback_button}
          title={'Feedback'}
          icon={'mdi:feedback-outline'}
          onClick={() => setIsOpen(true)}
        />
      )}
      <Modal isOpen={isOpen} className={styles.modal}>
        <IconButton
          className={styles.modal_close_button}
          title={'Close'}
          icon={'mdi:plus'}
          height={'35'}
          onClick={() => setIsOpen(false)}
          avatarColor={'red'}
        />
        {ModalContent()}
      </Modal>
    </div>
  );
}

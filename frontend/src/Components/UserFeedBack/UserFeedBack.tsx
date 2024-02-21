import styles from './UserFeedBack.module.scss';
import { IconButton, Modal } from '~/Components';
import { useState } from 'react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { postFeedback } from '~/api';

type UserFeedBackProps = {
  enabled: boolean;
};

export function UserFeedBack({ enabled }: UserFeedBackProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) {
    return <div></div>;
  }

  const handleFormSubmit = (formData: Record<string, string>) => {
    postFeedback({
      text: formData['feedback-text'],
      screen_resolution: window.innerWidth + 'x' + window.innerHeight,
      path: window.location.pathname,
      contact_email: formData['feedback-email'],
    })
      .then(() => setIsOpen(false))
      .catch((e) => {
        console.error(e);
      });
  };

  const modalContent = () => {
    return (
      <SamfForm onSubmit={handleFormSubmit} isDisabled={!isOpen} submitText={t(KEY.common_send)}>
        <h1>
          <b>{t(KEY.feedback_type_heading)}</b>
        </h1>
        <br />
        <text>{t(KEY.feedback_helper_text)}</text>
        <SamfFormField field={'feedback-text'} type={'text-long'} label={t(KEY.feedback_your_feedback)} />
        <text>{t(KEY.feedback_want_contact_text)}</text>
        <SamfFormField
          field={'feedback-email'}
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
        <div className={styles.feedback_div}>
          <IconButton
            color={'orange'}
            className={styles.feedback_button}
            title={'Feedback'}
            icon={'mdi:feedback-outline'}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}
      <Modal isOpen={isOpen} className={styles.modal}>
        <IconButton
          className={styles.modal_close_button}
          title={'Close'}
          icon={'mdi:plus'}
          height={'35'}
          onClick={() => setIsOpen(false)}
        />
        {modalContent()}
      </Modal>
    </div>
  );
}

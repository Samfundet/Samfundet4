import styles from './UserFeedback.module.scss';
import { IconButton, Modal } from '~/Components';
import { useState } from 'react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { postFeedback } from '~/api';
import { useTextItem } from '~/hooks';
import { TextItem } from '~/constants';
import { toast } from 'react-toastify';

type UserFeedbackProps = {
  enabled: boolean;
};

type FormProps = {
  text: string;
  contact_email?: string;
};

export function UserFeedback({ enabled }: UserFeedbackProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) {
    return <div />;
  }

  const handleFormSubmit = (formData: FormProps) => {
    postFeedback({
      ...formData,
      screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
      path: window.location.pathname,
    })
      .then(() => {
        setIsOpen(false);
        toast.success(t(KEY.feedback_thank_you_for_feedback));
      })
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
        <SamfFormField<string, FormProps>
          field={'text'}
          type={'text_long'}
          required={true}
          label={t(KEY.feedback_your_feedback)}
        />
        <p>{useTextItem(TextItem.feedback_want_contact_text)}</p>
        <SamfFormField<string, FormProps>
          field={'contact_email'}
          type={'email'}
          label={`${t(KEY.common_email)} (${t(KEY.common_not_required)})`}
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

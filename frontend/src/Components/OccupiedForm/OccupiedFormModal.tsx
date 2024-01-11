import { useState } from 'react';
import styles from './OccupiedForm.module.scss';
import { Modal } from '../Modal';
import { IconButton } from '../IconButton';
import { OccupiedForm } from './OccupiedForm';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';

type OccupiedFormModalProps = {
  recruitmentId: number;
};

export function OccupiedFormModal({ recruitmentId = 1 }: OccupiedFormModalProps) {
  const { t } = useTranslation();
  const [occupiedModal, setOccupiedModal] = useState(false);

  return (
    <>
      <Button theme="samf" onClick={() => setOccupiedModal(true)}>
        {t(KEY.occupied_show)}
      </Button>
      <Modal isOpen={occupiedModal}>
        <>
          <IconButton
            title="close"
            className={styles.close}
            icon="mdi:close"
            onClick={() => setOccupiedModal(false)}
          ></IconButton>
          <OccupiedForm recruitmentId={recruitmentId}></OccupiedForm>
        </>
      </Modal>
    </>
  );
}

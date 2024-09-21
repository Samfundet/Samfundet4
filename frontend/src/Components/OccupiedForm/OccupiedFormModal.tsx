import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { OccupiedForm } from './OccupiedForm';
import styles from './OccupiedForm.module.scss';

type OccupiedFormModalProps = {
  recruitmentId: number;
  isButtonRounded?: boolean;
};

export function OccupiedFormModal({ recruitmentId = 1, isButtonRounded = false }: OccupiedFormModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button theme="samf" rounded={isButtonRounded} onClick={() => setOpen(true)}>
        {t(KEY.occupied_show)}
      </Button>

      <Modal isOpen={open} className={styles.occupied_modal}>
        <>
          <button type="button" className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
            <Icon icon="octicon:x-24" width={24} />
          </button>
          <OccupiedForm recruitmentId={recruitmentId} onCancel={() => setOpen(false)} />
        </>
      </Modal>
    </>
  );
}

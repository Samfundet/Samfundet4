import { useState } from 'react';
import styles from './OccupiedForm.module.scss';
import { Modal } from '../Modal';
import { OccupiedForm } from './OccupiedForm';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { Icon } from '@iconify/react';

type OccupiedFormModalProps = {
  recruitmentId: number;
};

export function OccupiedFormModal({ recruitmentId = 1 }: OccupiedFormModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button theme="samf" onClick={() => setOpen(true)}>
        {t(KEY.occupied_show)}
      </Button>

      <Modal isOpen={open} className={styles.occupied_modal}>
        <>
          <button className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
            <Icon icon="octicon:x-24" width={24} />
          </button>
          <OccupiedForm recruitmentId={recruitmentId} onCancel={() => setOpen(false)} />
        </>
      </Modal>
    </>
  );
}

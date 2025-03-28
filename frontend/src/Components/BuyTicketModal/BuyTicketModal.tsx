import { Icon } from '@iconify/react';
import { useState } from 'react';
import { logoBlack, logoWhite } from '~/assets';
import type { EventDto } from '~/dto';
import { dbT } from '~/utils';
import { Modal } from '../Modal';
import BuyTicketForm from './BuyTicketForm';
import styles from './BuyTicketModal.module.scss';

type BuyTicketModalProps = {
  event: EventDto;
  isOpen: boolean;
  onClose: () => void;
};

export function BuyTicketModal({ event, isOpen, onClose }: BuyTicketModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} className={styles.modal}>
        <img src={logoBlack} className={styles.samf_logo_black} alt="LogoBlack" />
        <img src={logoWhite} className={styles.samf_logo_white} alt="LogoWhite" />
        <h2 className={styles.modal_title}>{dbT(event, 'title')}</h2>
        <button type="button" className={styles.close_btn} title="Close" onClick={onClose}>
          <Icon icon="octicon:x-24" width={24} />
        </button>
        <BuyTicketForm event={event} />
      </Modal>
    </>
  );
}

import { Icon } from '@iconify/react';
import { t } from 'i18next';
import { useState } from 'react';
import { logoBlack, logoWhite } from '~/assets';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT, lowerCapitalize } from '~/utils';
import { Button } from '../Button';
import { Modal } from '../Modal';
import BuyTicketForm from './BuyTicketForm';
import styles from './BuyTicketModal.module.scss';

type BuyTicketModalProps = {
  event: EventDto;
};

export function BuyTicketModal({ event }: BuyTicketModalProps) {
  const [open, setOpen] = useState(false);

  const ticketButton = (
    <Button theme={'samf'} className={styles.ticket_button} onClick={() => setOpen(true)}>
      <Icon icon="ph:ticket-bold" />
      {lowerCapitalize(`${t(KEY.common_buy)} ${t(KEY.common_ticket_type)}`)}
    </Button>
  );

  return (
    <>
      {ticketButton}

      <Modal isOpen={open} className={styles.modal}>
        <img src={logoBlack} className={styles.samf_logo_black} alt="LogoBlack" />
        <img src={logoWhite} className={styles.samf_logo_white} alt="LogoWhite" />
        <h2 className={styles.modal_title}>{dbT(event, 'title')}</h2>
        <button type="button" className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
          <Icon icon="octicon:x-24" width={24} />
        </button>
        <BuyTicketForm event={event} />
      </Modal>
    </>
  );
}

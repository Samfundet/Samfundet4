import { Icon } from '@iconify/react';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { dbT, lowerCapitalize } from '~/utils';
import { t } from 'i18next';
import styles from './BuyTicketModal.module.scss';
import { useState } from 'react';
import BuyTicketForm from './BuyTicketForm';
import type { EventDto } from '~/dto';

type BuyTicketModalProps = {
  event: EventDto;
};

export function BuyTicketModal({ event }: BuyTicketModalProps) {

  const [open, setOpen] = useState(false);


  const ticketButton = (
    <Button theme={'samf'} 
    className={styles.ticket_button}
    onClick={() => setOpen(true)}>
      <Icon icon="ph:ticket-bold" />
      {lowerCapitalize(`${t(KEY.common_buy)} ${t(KEY.common_ticket_type)}`)}
      </Button>
    );

  return (
    <>
      {ticketButton}

      <Modal isOpen={open} className={styles.modal}>
        <h2 className={styles.modal_title}>{dbT(event, 'title')}</h2>
          <button type="button" className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
            <Icon icon="octicon:x-24" width={24} />
          </button>
          <BuyTicketForm event={event} />
      </Modal>
    </>
  );
}

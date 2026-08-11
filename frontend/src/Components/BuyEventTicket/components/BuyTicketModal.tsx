import { H2 } from '~/Components/H2';
import { logoBlack, logoWhite } from '~/assets';
import type { EventDto } from '~/dto';
import { useIsDarkTheme } from '~/hooks';
import { COLORS } from '~/types';
import { dbT } from '~/utils';
import { IconButton } from '../../IconButton';
import { Modal } from '../../Modal';
import BuyTicketForm from './BuyTicketForm';
import styles from './BuyTicketModal.module.scss';

type BuyTicketModalProps = {
  event: EventDto;
  isOpen: boolean;
  onClose: () => void;
};

export function BuyTicketModal({ event, isOpen, onClose }: BuyTicketModalProps) {
  const isDarkmode = useIsDarkTheme();

  return (
    <>
      <Modal isOpen={isOpen} className={styles.modal}>
        <div className={styles.buy_ticket_modal_header}>
          {
            // TODO: add conditional for hiding Samfundet logo (issue #1865)
            // something like:
            // event.external_event_organizer && (
            //   isDarkmode ?
            //   <img src={logoWhite} className={styles.samf_logo} alt="LogoWhite" /> :
            //   <img src={logoBlack} className={styles.samf_logo} alt="LogoBlack" />
            // )
            isDarkmode ? (
              <img src={logoWhite} className={styles.samf_logo} alt="LogoWhite" />
            ) : (
              <img src={logoBlack} className={styles.samf_logo} alt="LogoBlack" />
            )
          }
          <IconButton
            title="close"
            icon="mdi:close"
            className={styles.close_btn}
            color={isDarkmode ? COLORS.white : COLORS.black}
            avatarColor={isDarkmode ? COLORS.black : COLORS.white}
            onClick={onClose}
          />
        </div>
        <H2 className={styles.modal_title}>{dbT(event, 'title')}</H2>
        <BuyTicketForm event={event} />
      </Modal>
    </>
  );
}

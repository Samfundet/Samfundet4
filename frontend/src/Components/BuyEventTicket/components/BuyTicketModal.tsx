import { skipToken, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components/Button';
import { H2 } from '~/Components/H2';
import { getBilligCheckoutTickets } from '~/apis/billig/billigApi';
import { logoBlack, logoWhite } from '~/assets';
import type { EventDto } from '~/dto';
import { useIsDarkTheme } from '~/hooks';
import { KEY } from '~/i18n/constants';
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
  const { t } = useTranslation();
  const billigEventId = event.billig?.id;
  const {
    data: ticketGroups,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['billig-checkout-tickets', billigEventId],
    queryFn: billigEventId === undefined ? skipToken : () => getBilligCheckoutTickets(billigEventId),
    enabled: isOpen,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      <Modal isOpen={isOpen} className={styles.modal}>
        <div className={styles.buy_ticket_modal_header}>
          {isDarkmode ? (
            <img src={logoWhite} className={styles.samf_logo} alt="Studentersamfundet" />
          ) : (
            <img src={logoBlack} className={styles.samf_logo} alt="Studentersamfundet" />
          )}
          <IconButton
            title="close"
            icon="mdi:close"
            className={styles.close_btn}
            color={isDarkmode ? COLORS.white : COLORS.black}
            avatarColor={isDarkmode ? COLORS.black : COLORS.white}
            onClick={onClose}
          />
        </div>
        <div className={styles.title_block}>
          <H2 className={styles.modal_title}>{dbT(event, 'title')}</H2>
        </div>
        {billigEventId === undefined || isError ? (
          <div className={styles.container}>
            <p role="alert">{t(KEY.ticket_checkout_load_error)}</p>
            {billigEventId !== undefined && <Button onClick={() => refetch()}>{t(KEY.ticket_checkout_retry)}</Button>}
          </div>
        ) : isPending || isFetching ? (
          <p className={styles.container} role="status">
            {t(KEY.common_loading)}
          </p>
        ) : ticketGroups.length === 0 ? (
          <p className={styles.container} role="status">
            {t(KEY.ticket_checkout_empty)}
          </p>
        ) : (
          <BuyTicketForm event={event} ticketGroups={ticketGroups} />
        )}
      </Modal>
    </>
  );
}

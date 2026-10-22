import { skipToken, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components/Button';
import { H2 } from '~/Components/H2';
import { getBilligCheckoutErrorCode, getBilligCheckoutTickets } from '~/apis/billig/billigApi';
import type { BilligCheckoutErrorCode } from '~/apis/billig/billigDtos';
import { logoBlack, logoWhite } from '~/assets';
import type { EventDto } from '~/domain';
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

const checkoutErrorMessages: Record<BilligCheckoutErrorCode, string> = {
  event_not_found: KEY.ticket_checkout_event_not_found,
  event_hidden: KEY.ticket_checkout_event_hidden,
  sale_not_started: KEY.ticket_checkout_sale_not_started,
  sale_ended: KEY.ticket_checkout_sale_ended,
  sold_out: KEY.ticket_checkout_sold_out,
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
    error,
    refetch,
  } = useQuery({
    queryKey: ['billig-checkout-tickets', billigEventId],
    queryFn: billigEventId === undefined ? skipToken : () => getBilligCheckoutTickets(billigEventId),
    enabled: isOpen,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const checkoutErrorCode = getBilligCheckoutErrorCode(error);

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
        {billigEventId === undefined || isError ? (
          <div className={styles.container}>
            <p role="alert">
              {t(checkoutErrorCode ? checkoutErrorMessages[checkoutErrorCode] : KEY.ticket_checkout_load_error)}
            </p>
            {billigEventId !== undefined && !checkoutErrorCode && (
              <Button onClick={() => refetch()}>{t(KEY.ticket_checkout_retry)}</Button>
            )}
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

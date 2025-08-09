import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { BuyTicketModal } from './components';

type BuyButtonProps = {
  event: EventDto;
  ticketSaleState: Pick<BilligEventDto, 'is_sold_out' | 'is_almost_sold_out'>;
};

export function BuyEventTicket({ event, ticketSaleState }: BuyButtonProps) {
  const { t } = useTranslation();
  const [buttonText, setButtonText] = useState<string>(t(KEY.common_buy));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (ticketSaleState.is_sold_out) {
      setButtonText(t(KEY.common_sold_out));
    } else {
      setButtonText(t(KEY.common_almost_sold_out));
    }
  }, [ticketSaleState, t]);

  return (
    <>
      <Button theme={'samf'} onClick={() => setShowModal(true)}>
      <Icon icon="ph:ticket-bold" />
      {buttonText}
      </Button>
      <BuyTicketModal event={event} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

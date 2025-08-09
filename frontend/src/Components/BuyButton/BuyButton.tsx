import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';

type BuyButtonProps = {
  eventId: number;
  billigId: number;
  ticketSaleState: Pick<BilligEventDto, 'is_sold_out' | 'is_almost_sold_out'>;
};

export function BuyButton({ eventId, billigId, ticketSaleState }: BuyButtonProps) {
  const [buttonText, setButtonText] = useState<string>('Kjøp');
  const { t } = useTranslation();
  if (ticketSaleState.is_sold_out) {
    setButtonText(t(KEY.common_sold_out));
  }
  if (ticketSaleState.is_almost_sold_out) {
    setButtonText(t(KEY.common_almost_sold_out));
  }
  const openPaymentForm = () => {
    alert(`ToDo: Open payment form modal with eventId ${eventId} and billigId ${billigId}`);
  };
  return (
    <Button theme={'samf'} onClick={openPaymentForm}>
      {buttonText}
    </Button>
  );
}

import { useState } from 'react';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { Button } from '../Button';

type BuyButtonProps = {
  eventId: number;
  billigId: number;
  ticketSaleState: Pick<BilligEventDto, 'is_sold_out' | 'is_almost_sold_out'>;
};

export function BuyButton({ eventId, billigId, ticketSaleState }: BuyButtonProps) {
  const [buttonText, setButtonText] = useState<string>('Kjøp');
  if (ticketSaleState.is_sold_out) {
    setButtonText('Utsolgt');
  }
  if (ticketSaleState.is_almost_sold_out) {
    setButtonText('Nesten utsolgt, kjøp!');
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

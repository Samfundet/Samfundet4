import { useState } from 'react';
import type { BilligTicketGroupDto } from '~/apis/billig/billigDtos';
import { Button } from '../Button';

type BuyButtonProps = {
  ticketSalesState: BilligTicketGroupDto;
};

export function BuyButton({ ticketSalesState }: BuyButtonProps) {
  const [buttonText, setButtonText] = useState<string>('Kjøp');
  if (ticketSalesState.is_sold_out) {
    setButtonText('Utsolgt');
  }
  if (ticketSalesState.is_almost_sold_out) {
    setButtonText('Nesten utsolgt, kjøp!');
  }
  const openPaymentForm = () => {
    alert('TODO: PR #1695');
  };
  return (
    <Button
      theme={'samf'}
      onClick={() => {
        openPaymentForm;
      }}
    >
      {buttonText}
    </Button>
  );
}

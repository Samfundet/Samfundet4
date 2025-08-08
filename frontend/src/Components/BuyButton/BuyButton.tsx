import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';

type BuyButtonProps = {
  eventId: number;
  billigId: number;
  ticketSaleState: Pick<BilligEventDto, 'is_sold_out' | 'is_almost_sold_out'>;
  onClick?: () => void;
};

export function BuyButton({ eventId, billigId, ticketSaleState, onClick }: BuyButtonProps) {
  const { t } = useTranslation();
  const [buttonText, setButtonText] = useState<string>(t(KEY.common_buy));


  useEffect(() => {
    if (ticketSaleState.is_sold_out) {
      setButtonText(t(KEY.common_sold_out));
    } else {
      setButtonText(t(KEY.common_almost_sold_out));
    }
  }, [ticketSaleState, t]);

  const handleClick = () => {
    if (onClick) return onClick();
  };

  return (
    <Button theme={'samf'} onClick={handleClick}>
      <Icon icon="ph:ticket-bold" />
      {buttonText}
    </Button>
  );
}

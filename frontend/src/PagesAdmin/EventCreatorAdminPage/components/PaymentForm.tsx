import { useTranslation } from 'react-i18next';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { SamfFormField } from '~/Forms/SamfFormField';
import { EventCustomTicketDto, EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_TICKET_TYPES, EventTicketTypeValue } from '~/types';
import { getTicketTypeKey } from '~/utils';
import { CustomTicketEditor } from './CustomTicketEditor';

type PaymentFormProps = {
  // The event being edited
  event: Partial<EventDto>;
  // Callback to alert parent of desired change in event
  onChange?(event: Partial<EventDto>): void;
};

export function PaymentForm({ event, onChange }: PaymentFormProps) {
  const { t } = useTranslation();

  // Dropdown for price group
  const ticketTypeOptions: DropDownOption<EventTicketTypeValue>[] = ALL_TICKET_TYPES.map((ticketType) => {
    return {
      value: ticketType,
      label: t(getTicketTypeKey(ticketType)) ?? '',
    };
  });

  // Billig payment setup
  const billigTicketOptions = (
    <SamfFormField
      type="options"
      field="billig_event"
      label="TODO Billig event"
      required={event.ticket_type === 'billig'}
      hidden={event.ticket_type !== 'billig'}
    />
  );

  function handleCustomTicketChanged(customTickets: EventCustomTicketDto[]) {
    onChange?.({
      custom_tickets: customTickets,
    });
  }

  return (
    <>
      <SamfFormField
        field="ticket_type"
        type="options"
        options={ticketTypeOptions}
        label={t(KEY.common_ticket_type) ?? ''}
      />
      {billigTicketOptions}
      {event.ticket_type === 'custom' && (
        <CustomTicketEditor customTickets={event.custom_tickets} onSetCustomTickets={handleCustomTicketChanged} />
      )}
    </>
  );
}

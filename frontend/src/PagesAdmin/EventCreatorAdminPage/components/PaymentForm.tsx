import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { SamfFormField } from '~/Forms/SamfFormField';
import type { EventCustomTicketDto, EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_TICKET_TYPES, type EventTicketTypeValue } from '~/types';
import { getTicketTypeKey } from '~/utils';
import { CustomTicketEditor } from './CustomTicketEditor';
import { Dropdown, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/Components';
import { formToJSON } from 'axios';
import { useFormContext } from 'react-hook-form';

type PaymentFormProps = {
  // The event being edited
  event: Partial<EventDto>;
  // Callback to alert parent of desired change in event
  onChange?(event: Partial<EventDto>): void;
};

export function PaymentForm({ event, onChange }: PaymentFormProps) {
  const { t } = useTranslation();
  const form = useFormContext<any>();

  // Dropdown for price group
  const ticketTypeOptions: DropdownOption<EventTicketTypeValue>[] = ALL_TICKET_TYPES.map((ticketType) => {
    return {
      value: ticketType,
      label: t(getTicketTypeKey(ticketType)) ?? '',
    };
  });

  const payOptions: DropdownOption<string>[] = [
    { value: 'member', label: 'Medlem' },
    { value: 'ikke-medlem', label: 'Ikke-medlem' },
  ];

  // Billig payment setup
  // const billigTicketOptions = (
  //   <SamfFormField
  //     type="options"
  //     field="billig_event"
  //     label="TODO Billig event"
  //     required={event.ticket_type === 'billig'}
  //     hidden={event.ticket_type !== 'billig'}
  //   />
  // );

  // function handleCustomTicketChanged(customTickets: EventCustomTicketDto[]) {
  //   onChange?.({
  //     custom_tickets: customTickets,
  //   });
  // }

  const ticketType = form.watch('ticket_type');

  return (
    <>
      <FormField
        name="ticket_type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(KEY.common_the_ticket_type)}</FormLabel>
            <FormControl>
              <Dropdown options={ticketTypeOptions} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {ticketType === 'free_with_registration' && (
        <FormField
          name="registration_url"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>registration url</FormLabel>
              <FormControl>
                <input placeholder="http://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {ticketType === 'free_with_registration' && (
        <FormField
          name="spots"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>registration url</FormLabel>
              <FormControl>
                <input placeholder="http://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Free with registration */}
      {/* <SamfFormField
        field="registration_url"
        type="text"
        label={'registration_url'}
        // placeholder="https://..."
        required={event.ticket_type === 'free_with_registration'}
        hidden={event.ticket_type !== 'free_with_registration'}
      /> */}

      {/* Billig */}
      {/* <SamfFormField
        field="billig"
        type="options"
        options={billigOptions}
        label={'payment_options'}
        required={event.ticket_type === 'billig'}
        hidden={event.ticket_type !== 'billig'}
      /> */}

      {/* Custom  */}
      {/* {event.ticket_type === 'custom' && (
        <div style={{ marginTop: 8 }}>
          <CustomTicketEditor customTickets={event.custom_tickets} onSetCustomTickets={handleCustomTicketChanged} />
        </div>
      )} */}
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dropdown, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { getBilligEvents } from '~/api';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_TICKET_TYPES, type EventTicketTypeValue } from '~/types';
import { getTicketTypeKey } from '~/utils';
import type { EventFormType } from '../EventCreatorSchema';
import { CustomTicketEditor } from './CustomTicketEditor';

type PaymentFormProps = {
  // The event being edited
  event: Partial<EventDto>;
  // Callback to alert parent of desired change in event
  onChange?(event: Partial<EventDto>): void;
};

export function PaymentForm({ event, onChange }: PaymentFormProps) {
  const { t } = useTranslation();
  const form = useFormContext<EventFormType>();
  const ticketType = form.watch('ticket_type');
  const customTickets = form.watch('custom_tickets') ?? [];

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

  const { data: billigEvents = [] } = useQuery<BilligEventDto[]>({
    queryKey: ['billigEvents'],
    queryFn: getBilligEvents,
    enabled: ticketType === 'billig',
  });

  return (
    <>
      <FormField
        name="ticket_type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(KEY.common_the_ticket_type)}</FormLabel>
            <FormControl>
              <Dropdown options={ticketTypeOptions} nullOption={{ label: t(KEY.common_choose) }} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {ticketType === 'registration' && (
        <FormField
          name="registration_url"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.event_registration_url)}</FormLabel>
              <FormControl>
                <input type="text" {...field} placeholder="http://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {ticketType === 'custom' && (
        <CustomTicketEditor
          customTickets={customTickets}
          onSetCustomTickets={(ticket) => {
            form.setValue('custom_tickets', ticket, { shouldDirty: true });
          }}
        />
      )}

      {ticketType === 'billig' && (
        <FormField
          name="billig_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billig Event</FormLabel>
              <FormControl>
                <Dropdown
                  options={billigEvents.map((e) => ({
                    value: e.id,
                    label: e.name,
                  }))}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

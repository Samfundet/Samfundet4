import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { Button, InputField } from '~/Components';
import { EventCustomTicketDto } from '~/dto';
import styles from './CustomTicketEditor.module.scss';

type PaymentFormProps = {
  customTickets?: EventCustomTicketDto[];
  onSetCustomTickets?(customTickets: EventCustomTicketDto[]): void;
};

export function CustomTicketEditor({ customTickets = [], onSetCustomTickets }: PaymentFormProps) {
  // const { t } = useTranslation();

  // Add default custom ticket
  useEffect(() => {
    if (customTickets.length === 0) {
      onSetCustomTickets?.([{ id: 0, name_nb: 'Billett 1', name_en: 'Ticket 1', price: 100 }]);
    }
  }, [onSetCustomTickets, customTickets]);

  // Functions to add/edit/remove
  function removeTicket(ticket: EventCustomTicketDto) {
    onSetCustomTickets?.(customTickets.filter((t) => t.id !== ticket.id));
  }

  function newTicket() {
    const lastTicket = customTickets[customTickets.length - 1];
    const nextId = lastTicket.id + 1;
    onSetCustomTickets?.([
      ...customTickets,
      { id: nextId, name_nb: `Ny billett`, name_en: `New ticket`, price: lastTicket.price },
    ]);
  }

  function updateTicket(id: number, edit: Partial<EventCustomTicketDto>) {
    onSetCustomTickets?.(
      customTickets.map((current: EventCustomTicketDto) => {
        if (current.id !== id) return current;
        return {
          ...current,
          ...edit,
          id: id,
        };
      }),
    );
  }

  /** UI for a custom ticket */
  function customTicket(custom_ticket: EventCustomTicketDto) {
    return (
      <div className={styles.custom_ticket} key={custom_ticket.id}>
        <InputField<string>
          inputClassName={styles.custom_ticket_input}
          labelClassName={styles.custom_ticket_input_label}
          value={custom_ticket.name_nb}
          onChange={(name) => updateTicket(custom_ticket.id, { name_nb: name })}
        >
          Navn (norsk)
        </InputField>
        <InputField<string>
          inputClassName={styles.custom_ticket_input}
          labelClassName={styles.custom_ticket_input_label}
          value={custom_ticket.name_en}
          onChange={(name) => updateTicket(custom_ticket.id, { name_en: name })}
        >
          Navn (engelsk)
        </InputField>
        <InputField<number>
          inputClassName={styles.custom_ticket_input}
          labelClassName={styles.custom_ticket_input_label}
          value={custom_ticket.price?.toString()}
          type="number"
          onChange={(price) => updateTicket(custom_ticket.id, { price: price })}
        >
          Pris
        </InputField>
        {/* Delete button (only if at least one ticket) */}
        {customTickets.length > 1 && (
          <Button
            theme="white"
            preventDefault={true}
            display="pill"
            className={styles.custom_ticket_delete_button}
            onClick={() => removeTicket(custom_ticket)}
          >
            Slett <Icon icon="mdi:close"></Icon>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.custom_ticket_container}>
        {customTickets.map((custom_ticket) => customTicket(custom_ticket))}
        <div className={styles.add_custom_ticket}>
          <Button rounded={true} theme="green" preventDefault={true} onClick={newTicket}>
            Legg til billett
            <Icon icon="mdi:plus"></Icon>
          </Button>
        </div>
      </div>
    </>
  );
}

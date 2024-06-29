import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, InputField } from '~/Components';
import { Table, type TableRow } from '~/Components/Table';
import type { EventCustomTicketDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CustomTicketEditor.module.scss';

type PaymentFormProps = {
  customTickets?: EventCustomTicketDto[];
  onSetCustomTickets?(customTickets: EventCustomTicketDto[]): void;
};

export function CustomTicketEditor({ customTickets = [], onSetCustomTickets }: PaymentFormProps) {
  const { t } = useTranslation();

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
      { id: nextId, name_nb: 'Ny billett', name_en: 'New ticket', price: lastTicket.price },
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
  function ticketRow(custom_ticket: EventCustomTicketDto): TableRow {
    const deleteButton =
      customTickets.length > 1
        ? {
            content: (
              <IconButton
                color={COLORS.red}
                onClick={() => removeTicket(custom_ticket)}
                title=""
                icon="mdi:bin"
                className={styles.delete_button}
              />
            ),
          }
        : {};
    return [
      {
        content: (
          <InputField<string>
            inputClassName={styles.custom_ticket_input}
            labelClassName={styles.custom_ticket_input_label}
            value={custom_ticket.name_nb}
            onChange={(name) => updateTicket(custom_ticket.id, { name_nb: name })}
          />
        ),
      },
      {
        content: (
          <InputField<string>
            inputClassName={styles.custom_ticket_input}
            labelClassName={styles.custom_ticket_input_label}
            value={custom_ticket.name_en}
            onChange={(name) => updateTicket(custom_ticket.id, { name_en: name })}
          />
        ),
      },
      {
        content: (
          <InputField<number>
            inputClassName={styles.custom_ticket_input}
            labelClassName={styles.custom_ticket_input_label}
            value={custom_ticket.price?.toString()}
            type="number"
            onChange={(price) => updateTicket(custom_ticket.id, { price: price })}
          />
        ),
      },
      deleteButton,
    ];
  }

  const tableColumns = [
    `${t(KEY.common_name)} (${t(KEY.common_english)})`,
    `${t(KEY.common_name)} (${t(KEY.common_norwegian)})`,
    'Pris',
    '',
  ];

  return (
    <>
      <div className={styles.custom_ticket_container}>
        <Table columns={tableColumns} data={customTickets.map((ticket) => ticketRow(ticket))} />
        <div className={styles.add_custom_ticket}>
          <Button rounded={true} theme="green" preventDefault={true} onClick={newTicket}>
            Legg til billett
            <Icon icon="mdi:plus" />
          </Button>
        </div>
      </div>
    </>
  );
}

import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, InputField } from '~/Components';
import { Table, type TableRow } from '~/Components/Table';
import type { EventCustomTicketDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CustomTicketEditor.module.scss';

type CustomTicketEditorProps = {
  initialTickets?: EventCustomTicketDto[];
  onTicketsChange?: (tickets: EventCustomTicketDto[]) => void;
};

// Default values for new tickets
const DEFAULT_TICKET_PRICE = 100;
const DEFAULT_FIRST_TICKET = {
  id: 0,
  name_nb: 'Billett 1',
  name_en: 'Ticket 1',
  price: DEFAULT_TICKET_PRICE,
};

export function CustomTicketEditor({ initialTickets = [], onTicketsChange }: CustomTicketEditorProps) {
  // Internal state to manage tickets - makes the component more self-contained
  const [tickets, setTickets] = useState<EventCustomTicketDto[]>(initialTickets);
  const { t } = useTranslation();

  // Handle initialization and sync with parent
  useEffect(() => {
    // If no initial tickets, create default ticket
    if (initialTickets.length === 0 && tickets.length === 0) {
      const defaultTickets = [DEFAULT_FIRST_TICKET];
      setTickets(defaultTickets);
      onTicketsChange?.(defaultTickets);
    }
    // If parent passes new initialTickets, update internal state
    else if (initialTickets.length > 0 && JSON.stringify(initialTickets) !== JSON.stringify(tickets)) {
      setTickets(initialTickets);
    }
  }, [initialTickets, tickets, onTicketsChange]);

  // Update both local state and notify parent
  const updateTicketsState = (newTickets: EventCustomTicketDto[]) => {
    setTickets(newTickets);
    onTicketsChange?.(newTickets);
  };

  // Generate unique ID for new ticket
  const generateUniqueId = (): number => {
    if (tickets.length === 0) return 0;
    // Find max ID and add 1 to ensure uniqueness
    return Math.max(...tickets.map((ticket) => ticket.id)) + 1;
  };

  // Add a new ticket to the list
  const addTicket = () => {
    const nextId = generateUniqueId();
    const defaultPrice = tickets.length > 0 ? tickets[tickets.length - 1].price : DEFAULT_TICKET_PRICE;

    const newTicket: EventCustomTicketDto = {
      id: nextId,
      name_nb: `Ny billett ${nextId + 1}`,
      name_en: `New ticket ${nextId + 1}`,
      price: defaultPrice,
    };

    updateTicketsState([...tickets, newTicket]);
  };

  // Remove a ticket from the list
  const removeTicket = (ticketId: number) => {
    updateTicketsState(tickets.filter((ticket) => ticket.id !== ticketId));
  };

  // Update fields for a specific ticket
  const updateTicket = (id: number, updates: Partial<EventCustomTicketDto>) => {
    updateTicketsState(
      tickets.map((ticket) => {
        if (ticket.id !== id) return ticket;
        return { ...ticket, ...updates };
      }),
    );
  };

  // Render a row for a ticket in the table
  const renderTicketRow = (ticket: EventCustomTicketDto): TableRow => {
    // Only show delete button if there's more than one ticket
    const canDelete = tickets.length > 1;

    return {
      cells: [
        {
          content: (
            <InputField<string>
              inputClassName={styles.custom_ticket_input}
              labelClassName={styles.custom_ticket_input_label}
              value={ticket.name_en || ''}
              onChange={(name) => updateTicket(ticket.id, { name_en: name })}
              placeholder={t(KEY.common_english) || 'English'}
            />
          ),
        },
        {
          content: (
            <InputField<string>
              inputClassName={styles.custom_ticket_input}
              labelClassName={styles.custom_ticket_input_label}
              value={ticket.name_nb || ''}
              onChange={(name) => updateTicket(ticket.id, { name_nb: name })}
              placeholder={t(KEY.common_norwegian) || 'Norwegian'}
            />
          ),
        },
        {
          content: (
            <InputField<number>
              inputClassName={styles.custom_ticket_input}
              labelClassName={styles.custom_ticket_input_label}
              value={ticket.price?.toString() || '0'}
              type="number"
              onChange={(price) => updateTicket(ticket.id, { price: Number(price) || 0 })}
              placeholder="0"
            />
          ),
        },
        canDelete
          ? {
              content: (
                <IconButton
                  color={COLORS.red}
                  onClick={() => removeTicket(ticket.id)}
                  title={t(KEY.common_delete) || 'Delete'}
                  icon="mdi:bin"
                  className={styles.delete_button}
                />
              ),
            }
          : {},
      ],
    };
  };

  // Table column headers
  const tableColumns = [
    t(KEY.common_name) ? `${t(KEY.common_name)} (${t(KEY.common_english)})` : 'Name (English)',
    t(KEY.common_name) ? `${t(KEY.common_name)} (${t(KEY.common_norwegian)})` : 'Name (Norwegian)',
    t(KEY.common_price) || 'Price',
    '', // Column for delete button
  ];

  // If there are no tickets, create a default one
  if (tickets.length === 0) {
    return (
      <div className={styles.custom_ticket_container}>
        <div className={styles.loading}>{t(KEY.common_loading) || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className={styles.custom_ticket_container}>
      <Table columns={tableColumns} data={tickets.map(renderTicketRow)} />
      <div className={styles.add_custom_ticket}>
        <Button
          rounded={true}
          theme="green"
          preventDefault={true}
          onClick={addTicket}
          disabled={tickets.length >= 20} // Optional: prevent too many tickets
        >
          {'Add ticket'}
          <Icon icon="mdi:plus" />
        </Button>
      </div>
    </div>
  );
}

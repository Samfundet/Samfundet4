import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Link,
  RadioButton,
} from '~/Components';
import { validEmail } from '~/Forms/util';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './BuyTicketModal.module.scss';

// Validation schema
const buyTicketFormSchema = z
  .object({
    tickets: z.number().min(0),
    membershipTickets: z.number().min(0),
    membershipNumber: z.string().optional(),
    email: z
      .string()
      .refine(validEmail, { message: t(KEY.invalid_email_message) })
      .optional(),
    ticketType: z.enum(['email', 'membershipNumber']),
  })
  .refine((data) => data.email || data.membershipNumber, {
    message: t(KEY.email_or_membership_number_message),
    path: ['email'],
  })
  .refine((data) => data.tickets >= 1 || data.membershipTickets >= 1, {
    message: t(KEY.no_tickets_selected_message),
    path: ['tickets'],
  });

type BuyTicketFormType = z.infer<typeof buyTicketFormSchema>;

interface BuyTicketFormProps {
  initialData?: Partial<BuyTicketFormType>;
  event: EventDto;
}

const TICKET_TYPE_EMAIL = 'email';
const TICKET_TYPE_MEMBERSHIP = 'membershipNumber';

export function BuyTicketForm({ event }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const numberOfTickets = event.numberOfTickets ?? 9;

  const form = useForm<BuyTicketFormType>({
    resolver: zodResolver(buyTicketFormSchema),
    defaultValues: {
      tickets: 0,
      membershipTickets: 0,
      membershipNumber: '',
      email: '',
      ticketType: TICKET_TYPE_EMAIL,
    },
  });

  const ticketType = useWatch({ control: form.control, name: 'ticketType' });

  function onSubmit(data: BuyTicketFormType): void {
    console.log('Submitted Ticket Form Data:', data);
  }

  const price = event?.price ?? 50; //TODO: fetch from billig (in ISSUE #1797)
  const price_member = event?.price_member ?? 30;

  const tickets = useWatch({ control: form.control, name: 'tickets' });
  const membershipTickets = useWatch({ control: form.control, name: 'membershipTickets' });

  useEffect(() => {
    setTotalPrice(tickets * price + membershipTickets * price_member);
  }, [tickets, membershipTickets, price, price_member]);

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Ticket Selection */}
          <div className={styles.ticket_selection_container}>
            {/* Non-Member Tickets */}
            <div className={styles.ticket_select}>
              <div className={styles.select_info}>
                <p className={styles.select_label}>{`${t(KEY.common_not)}-${t(KEY.common_member)}`}</p>
                <p className={styles.price_label}>
                  {price} {t(KEY.kr_per_ticket)}
                </p>
              </div>
              <FormField
                control={form.control}
                name="tickets"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        {...field}
                        options={[...Array(numberOfTickets).keys()].map((num) => ({
                          label: `${num}`,
                          value: num.toString(),
                        }))}
                        onChange={(e) => {
                          if (e) {
                            form.setValue('tickets', Number(e));
                          }
                        }}
                        value={field.value.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Member Tickets */}
            <div className={styles.ticket_select}>
              <div className={styles.select_info}>
                <p className={styles.select_label}>{t(KEY.common_member)}</p>
                <p className={styles.price_label}>
                  {price_member} {t(KEY.kr_per_ticket)}
                </p>
              </div>
              <FormField
                control={form.control}
                name="membershipTickets"
                render={({ field }) => (
                  <FormItem className={styles.select_item}>
                    <FormControl>
                      <Dropdown
                        {...field}
                        options={[...Array(numberOfTickets).keys()].map((num) => ({
                          label: `${num}`,
                          value: num.toString(),
                        }))}
                        onChange={(e) => {
                          if (e) {
                            form.setValue('membershipTickets', Number(e));
                          }
                        }}
                        value={field.value.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Email / Membership Number Toggle */}
          <div className={styles.ticket_type}>
            <div className={styles.ticket_type_fields}>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    onChange={() => {
                      form.setValue('ticketType', TICKET_TYPE_MEMBERSHIP);
                      form.setValue('email', '');
                    }}
                    checked={ticketType === TICKET_TYPE_MEMBERSHIP}
                  />{' '}
                  <label>{t(KEY.common_membership_number)}</label>
                </div>
                {/* Membership Number Field */}
                <FormField
                  control={form.control}
                  name="membershipNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          className={styles.input_field}
                          disabled={ticketType !== TICKET_TYPE_MEMBERSHIP}
                          style={{
                            backgroundColor: ticketType === TICKET_TYPE_MEMBERSHIP ? 'white' : 'lightgrey',
                          }}
                          placeholder={t(KEY.enter_membership_number)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    onChange={() => {
                      form.setValue('ticketType', TICKET_TYPE_EMAIL);
                      form.setValue('membershipNumber', '');
                    }}
                    checked={ticketType === TICKET_TYPE_EMAIL}
                  />{' '}
                  <label className={styles.email_label}>{t(KEY.common_email)}</label>
                </div>
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={styles.email_field}>
                      <FormControl>
                        <Input
                          type={TICKET_TYPE_EMAIL}
                          className={styles.input_field}
                          disabled={ticketType !== TICKET_TYPE_EMAIL}
                          style={{
                            backgroundColor: ticketType === TICKET_TYPE_EMAIL ? 'white' : 'lightgray',
                          }}
                          placeholder={t(KEY.enter_email)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className={styles.ticket_type_description}>
              <div style={{ display: ticketType === TICKET_TYPE_MEMBERSHIP ? 'inline' : 'none' }}>
                <p>{t(KEY.ticketless_description)}</p>
                <Trans i18nKey={KEY.ticketless_description_note} components={{ strong: <strong /> }} />
              </div>
              <div style={{ display: ticketType === TICKET_TYPE_EMAIL ? 'inline' : 'none' }}>
                <p>{t(KEY.email_ticket_description)}</p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <a href={ROUTES.other.stripe_info} target="_blank" className={styles.link} rel="noreferrer">
              {t(KEY.stripe_info)}{' '}
            </a>
            <p>{t(KEY.pay_info)}</p>
            {/* TODO: Add the url when the page is made (in ISSUE #1827)*/}
            <Link url="#" className={styles.terms_link}>
              {t(KEY.sales_conditions)}
            </Link>
          </div>

          {/* Total Price */}
          <div className={styles.total_price}>
            <strong>
              {t(KEY.common_total)}: {totalPrice} NOK
            </strong>
          </div>

          {/* Submit Button */}
          <Button type="submit" className={styles.pay_button}>
            {t(KEY.common_to_payment)}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default BuyTicketForm;

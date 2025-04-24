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
    ticketQuantities: z.record(z.string(), z.number().min(0)),
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
  .refine((data) => Object.values(data.ticketQuantities ?? {}).some((qty) => qty > 0), {
    message: t(KEY.no_tickets_selected_message),
    path: ['ticketQuantities'],
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
  const ticket_groups = event.billig?.ticket_groups;

  const ticketGroupDefaults = ticket_groups?.reduce(
    (acc, group) => {
      const name = group.price_groups?.[0]?.name;
      if (name) acc[name] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const form = useForm<BuyTicketFormType>({
    resolver: zodResolver(buyTicketFormSchema),
    defaultValues: {
      ticketQuantities: ticketGroupDefaults,
      email: '',
      membershipNumber: '',
      ticketType: TICKET_TYPE_EMAIL,
    },
  });

  const ticketType = useWatch({ control: form.control, name: 'ticketType' });

  function onSubmit(data: BuyTicketFormType): void {
    console.log('Submitted Ticket Form Data:', data);
  }

  const ticketQuantities = useWatch({ control: form.control, name: 'ticketQuantities' });

  useEffect(() => {
    if (!ticketQuantities || !ticket_groups) return;

    let total = 0;
    for (const group of ticket_groups) {
      const name = group.price_groups?.[0]?.name;
      const price = group.price_groups?.[0]?.price ?? 0;
      const qty = ticketQuantities[name] ?? 0;

      total += qty * price;
    }
    setTotalPrice(total);
  }, [ticketQuantities, ticket_groups]);

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Ticket Selection */}
          {ticket_groups?.map((group) => {
            const name = group.price_groups?.[0]?.name;
            const price = group.price_groups?.[0]?.price ?? 0;
            const ticketLimit = group.ticket_limit ?? 9;

            return (
              <div key={name} className={styles.ticket_select}>
                <div className={styles.select_info}>
                  <p className={styles.select_label}>{name}</p>
                  <p className={styles.price_label}>
                    {price} {t(KEY.kr_per_ticket)}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name={`ticketQuantities.${name}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          options={[...Array(ticketLimit + 1).keys()].map((num) => ({
                            label: `${num}`,
                            value: num.toString(),
                          }))}
                          value={field.value?.toString() ?? '0'}
                          onChange={(e) => {
                            if (e) form.setValue(`ticketQuantities.${name}`, Number(e));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          })}

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

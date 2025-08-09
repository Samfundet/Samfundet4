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
  H3,
  Input,
  Link,
  RadioButton
} from '~/Components';
import { validEmail } from '~/Forms/util';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { COLORS } from '~/types';
import styles from './BuyTicketModal.module.scss';

// Validation schema
const buyTicketFormSchema = z
  .discriminatedUnion('ticketType', [
    z.object({
      ticketType: z.literal('membershipNumber'),
      membershipNumber: z.string().min(1, t(KEY.email_or_membership_number_message)),
      email: z.string().optional(),
      ticketQuantities: z.record(z.string(), z.number().min(0)),
    }),
    z.object({
      ticketType: z.literal('email'),
      email: z
        .string()
        .min(1, t(KEY.email_or_membership_number_message))
        .refine(validEmail, { message: t(KEY.invalid_email_message) }),
      membershipNumber: z.string().optional(),
      ticketQuantities: z.record(z.string(), z.number().min(0)),
    }),
  ])
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
      ticketType: TICKET_TYPE_MEMBERSHIP,
    },
  });

  const ticketType = useWatch({ control: form.control, name: 'ticketType' });

  function onSubmit(_data: BuyTicketFormType): void {
    confirm("TODO: INTEGRATE WITH REAL BILLIG")
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
            {/* Total Price */}
            <H3>{t(KEY.common_total)}: {totalPrice} NOK </H3>

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
                  >
                    {t(KEY.common_membership_number)}
                  </RadioButton>
                   <RadioButton
                    name="ticketType"
                    onChange={() => {
                      form.setValue('ticketType', TICKET_TYPE_EMAIL);
                      form.setValue('membershipNumber', '');
                    }}
                    checked={ticketType === TICKET_TYPE_EMAIL}
                  >
                    {t(KEY.common_email)}
                  </RadioButton>
                </div>
                {/* Membership Number Field */}
                {ticketType === TICKET_TYPE_MEMBERSHIP && (
                  <div className={styles.ticket_type_field}>
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
                              backgroundColor: ticketType === TICKET_TYPE_MEMBERSHIP ? COLORS.white : COLORS.grey_2,
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
                )}
              </div>
                {ticketType === TICKET_TYPE_EMAIL && (
                  <div className={styles.ticket_type_field}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            className={styles.input_field}
                            disabled={ticketType !== TICKET_TYPE_EMAIL}
                            style={{
                              backgroundColor: ticketType === TICKET_TYPE_EMAIL ? COLORS.white : COLORS.grey_2,
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
                )}              
            
                          {ticketType === TICKET_TYPE_MEMBERSHIP ? (
                  <>
                    <p className={styles.ticketless_description_p}>{t(KEY.ticketless_description)}</p>
                    <p className={styles.ticketless_description_p}>
                      <Trans
                        i18nKey={KEY.ticketless_description_note}
                        components={{ strong: <strong /> }}
                      />
                    </p>
                  </>
                ) : (
                  <p className={styles.ticketless_description_p}>{t(KEY.email_ticket_description)}</p>
                )}
            </div>
          </div>
          {/* Submit Button */}
          <Button type="submit" className={styles.pay_button}>
            {t(KEY.common_to_payment)}
          </Button>
        </form>
      </Form>
      {/* Terms and Conditions */}
      <p>{t(KEY.pay_info)}</p>
      <a href={ROUTES.other.stripe_info} target="_blank" className={styles.link} rel="noreferrer">
        {t(KEY.stripe_info)}
      </a>
      <Link url="https://www.samfundet.no/informasjon/billetter" target='external' className={styles.terms_link}>
        {t(KEY.sales_conditions)}
      </Link>
    </div>
  );
}

export default BuyTicketForm;

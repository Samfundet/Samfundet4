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

// Base schema shared by both forms
const baseFormSchema = z.object({
  ticketQuantities: z.record(z.string(), z.number().min(0)),
});

// Membership form schema
const membershipFormSchema = baseFormSchema.extend({
  ticketType: z.literal('membershipNumber'),
  membershipNumber: z.string().min(1, t(KEY.email_or_membership_number_message)),
}).refine((data) => Object.values(data.ticketQuantities ?? {}).some((qty) => qty > 0), {
  message: t(KEY.no_tickets_selected_message),
  path: ['ticketQuantities'],
});

// Email form schema
const emailFormSchema = baseFormSchema.extend({
  ticketType: z.literal('email'),
  email: z
    .string()
    .min(1, t(KEY.email_or_membership_number_message))
    .refine(validEmail, { message: t(KEY.invalid_email_message) }),
}).refine((data) => Object.values(data.ticketQuantities ?? {}).some((qty) => qty > 0), {
  message: t(KEY.no_tickets_selected_message),
  path: ['ticketQuantities'],
});

type MembershipFormType = z.infer<typeof membershipFormSchema>;
type EmailFormType = z.infer<typeof emailFormSchema>;
type BuyTicketFormType = MembershipFormType | EmailFormType;

interface BuyTicketFormProps {
  initialData?: Partial<BuyTicketFormType>;
  event: EventDto;
}

const TICKET_TYPE_EMAIL = 'email';
const TICKET_TYPE_MEMBERSHIP = 'membershipNumber';

export function BuyTicketForm({ event }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketType, setTicketType] = useState<'membershipNumber' | 'email'>(TICKET_TYPE_MEMBERSHIP);
  const ticket_groups = event.billig?.ticket_groups;

  const ticketGroupDefaults = ticket_groups?.reduce(
    (acc, group) => {
      const name = group.price_groups?.[0]?.name;
      if (name) acc[name] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const currentSchema = ticketType === TICKET_TYPE_EMAIL ? emailFormSchema : membershipFormSchema;

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      ticketQuantities: ticketGroupDefaults,
      ticketType: ticketType,
      ...(ticketType === TICKET_TYPE_EMAIL 
        ? { email: '' }
        : { membershipNumber: '' }
      ),
    },
  });

  useEffect(() => {
    const newDefaultValues = {
      ticketQuantities: form.getValues('ticketQuantities'),
      ticketType: ticketType,
      ...(ticketType === TICKET_TYPE_EMAIL 
        ? { email: '' }
        : { membershipNumber: '' }
      ),
    };

    form.reset(newDefaultValues, { keepDefaultValues: false });
  }, [ticketType, form]);

  function onSubmit(_data: any): void {
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
                      setTicketType(TICKET_TYPE_MEMBERSHIP);
                    }}
                    checked={ticketType === TICKET_TYPE_MEMBERSHIP}
                  >
                    {t(KEY.common_membership_number)}
                  </RadioButton>
                   <RadioButton
                    name="ticketType"
                    onChange={() => {
                      setTicketType(TICKET_TYPE_EMAIL);
                    }}
                    checked={ticketType === TICKET_TYPE_EMAIL}
                  >
                    {t(KEY.common_email)}
                  </RadioButton>
                </div>
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
            <div className={styles.ticket_type_field}>
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

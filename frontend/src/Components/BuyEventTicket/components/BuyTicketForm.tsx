import { zodResolver } from '@hookform/resolvers/zod';
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
  RadioButton,
} from '~/Components';
import { validEmail } from '~/Forms/util';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { INFORMATION_PAGES } from '~/routes/samf-three';
import { COLORS } from '~/types';
import styles from './BuyTicketModal.module.scss';

const TICKET_TYPE_EMAIL = 'email';
const TICKET_TYPE_MEMBERSHIP = 'membershipNumber';

type TicketType = 'email' | 'membershipNumber';

// Create schema function that takes the translation function
const createBuyTicketFormSchema = (t: (key: string) => string) =>
  z
    .object({
      ticketQuantities: z.record(z.string(), z.number().min(0)),
      ticketType: z.enum([TICKET_TYPE_EMAIL, TICKET_TYPE_MEMBERSHIP]),
      email: z.string().optional(),
      membershipNumber: z.string().optional(),
    })
    .refine((data) => Object.values(data.ticketQuantities ?? {}).some((qty) => qty > 0), {
      message: t(KEY.no_tickets_selected_message),
      path: ['ticketQuantities'],
    })
    .superRefine((data, ctx) => {
      if (data.ticketType === 'email') {
        if (!data.email || data.email.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(KEY.email_or_membership_number_message),
            path: [TICKET_TYPE_EMAIL],
          });
        } else if (!validEmail(data.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(KEY.invalid_email_message),
            path: [TICKET_TYPE_EMAIL],
          });
        }
      }

      if (data.ticketType === TICKET_TYPE_MEMBERSHIP) {
        if (!data.membershipNumber || data.membershipNumber.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(KEY.email_or_membership_number_message),
            path: [TICKET_TYPE_MEMBERSHIP],
          });
        }
      }
    });

type BuyTicketFormType = z.infer<ReturnType<typeof createBuyTicketFormSchema>>;

interface BuyTicketFormProps {
  initialData?: Partial<BuyTicketFormType>;
  event: EventDto;
}

export function BuyTicketForm({ event }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketType, setTicketType] = useState<TicketType>(TICKET_TYPE_MEMBERSHIP);
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
    resolver: zodResolver(createBuyTicketFormSchema(t)),
    defaultValues: {
      ticketQuantities: ticketGroupDefaults,
      ticketType: ticketType,
      email: '',
      membershipNumber: '',
    },
  });

  useEffect(() => {
    const newDefaultValues = {
      ticketQuantities: form.getValues('ticketQuantities'),
      ticketType: ticketType,
      email: ticketType === TICKET_TYPE_EMAIL ? form.getValues(TICKET_TYPE_EMAIL) || '' : '',
      membershipNumber: ticketType === TICKET_TYPE_MEMBERSHIP ? form.getValues(TICKET_TYPE_MEMBERSHIP) || '' : '',
    };

    form.reset(newDefaultValues, { keepDefaultValues: false });
  }, [ticketType, form]);

  function onSubmit(data: BuyTicketFormType): void {
    confirm('TODO: INTEGRATE WITH REAL BILLIG');
    console.log('Form submitted with data:', data);
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
          <H3>
            {t(KEY.common_total)}: {totalPrice} NOK{' '}
          </H3>

          {/* Email / Membership Number Toggle */}
          <div className={styles.ticket_type}>
            <div className={styles.ticket_type_fields}>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    className={styles.radio_btn}
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
                    <Trans i18nKey={KEY.ticketless_description_note} components={{ strong: <strong /> }} />
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
      <Link url={INFORMATION_PAGES.informasjon_billetter} target="external" className={styles.terms_link}>
        {t(KEY.sales_conditions)}
      </Link>
    </div>
  );
}

export default BuyTicketForm;

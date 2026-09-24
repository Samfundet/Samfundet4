import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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
import { BILLIG_PURCHASE_CONTEXT_KEY, buildBilligFormData, submitBilligForm } from '~/apis/billig/billigApi';
import type { BilligCheckoutTicketGroupDto } from '~/apis/billig/billigDtos';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { INFORMATION_PAGES } from '~/routes/samf-three';
import styles from './BuyTicketModal.module.scss';

const TICKET_TYPE_EMAIL = 'email';
const TICKET_TYPE_MEMBERSHIP = 'membershipNumber';

type TicketQuantityMap = Record<string, number>;

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
      if (data.ticketType === TICKET_TYPE_EMAIL) {
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

      if (data.ticketType === TICKET_TYPE_MEMBERSHIP && !data.membershipNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(KEY.email_or_membership_number_message),
          path: [TICKET_TYPE_MEMBERSHIP],
        });
      }
    });

type BuyTicketFormType = z.infer<ReturnType<typeof createBuyTicketFormSchema>>;

interface BuyTicketFormProps {
  event: EventDto;
  ticketGroups: BilligCheckoutTicketGroupDto[];
  initialValues?: Partial<BuyTicketFormType>;
}

function getSelectedTicketCount(
  ticketGroup: BilligCheckoutTicketGroupDto,
  ticketQuantities: TicketQuantityMap | undefined,
): number {
  return ticketGroup.price_groups.reduce(
    (count, priceGroup) => count + (ticketQuantities?.[String(priceGroup.id)] ?? 0),
    0,
  );
}

export function BuyTicketForm({ event, ticketGroups, initialValues }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const ticketOptions = useMemo(() => ticketGroups.flatMap((ticketGroup) => ticketGroup.price_groups), [ticketGroups]);
  const eventCanUseMembershipCard = ticketOptions.some((priceGroup) => priceGroup.can_be_put_on_card);

  const ticketQuantityDefaults = useMemo(
    () =>
      ticketOptions.reduce((acc, priceGroup) => {
        acc[String(priceGroup.id)] = 0;
        return acc;
      }, {} as TicketQuantityMap),
    [ticketOptions],
  );

  const defaultValues = useMemo<BuyTicketFormType>(
    () => ({
      ticketQuantities: {
        ...ticketQuantityDefaults,
        ...Object.fromEntries(
          Object.keys(ticketQuantityDefaults).map((priceGroupId) => [
            priceGroupId,
            initialValues?.ticketQuantities?.[priceGroupId] ?? 0,
          ]),
        ),
      },
      ticketType:
        eventCanUseMembershipCard && initialValues?.ticketType !== TICKET_TYPE_EMAIL
          ? TICKET_TYPE_MEMBERSHIP
          : TICKET_TYPE_EMAIL,
      email: initialValues?.email ?? '',
      membershipNumber: initialValues?.membershipNumber ?? '',
    }),
    [eventCanUseMembershipCard, initialValues, ticketQuantityDefaults],
  );

  const form = useForm<BuyTicketFormType>({
    resolver: zodResolver(createBuyTicketFormSchema(t)),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const ticketQuantities = useWatch({ control: form.control, name: 'ticketQuantities' });
  const ticketType = useWatch({ control: form.control, name: 'ticketType' }) ?? defaultValues.ticketType;
  const selectedTicketCountsByGroup = useMemo(
    () =>
      Object.fromEntries(
        ticketGroups.map((ticketGroup) => [ticketGroup.id, getSelectedTicketCount(ticketGroup, ticketQuantities)]),
      ),
    [ticketGroups, ticketQuantities],
  );
  const selectedPriceGroups = useMemo(
    () => ticketOptions.filter((priceGroup) => (ticketQuantities?.[String(priceGroup.id)] ?? 0) > 0),
    [ticketOptions, ticketQuantities],
  );
  const selectedTicketsCanBePutOnCard =
    eventCanUseMembershipCard &&
    (selectedPriceGroups.length === 0 || selectedPriceGroups.every((priceGroup) => priceGroup.can_be_put_on_card));

  useEffect(() => {
    if (!selectedTicketsCanBePutOnCard && ticketType === TICKET_TYPE_MEMBERSHIP) {
      form.setValue('ticketType', TICKET_TYPE_EMAIL, { shouldValidate: true });
    }
  }, [form, selectedTicketsCanBePutOnCard, ticketType]);

  const selectedTicketsRequireMembership = selectedPriceGroups.some((priceGroup) => priceGroup.membership_needed);
  const totalPrice = useMemo(
    () =>
      ticketOptions.reduce(
        (total, priceGroup) => total + (ticketQuantities?.[String(priceGroup.id)] ?? 0) * priceGroup.price,
        0,
      ),
    [ticketOptions, ticketQuantities],
  );
  const totalTicketFee = useMemo(() => {
    const ticketFee = Math.max(event.billig?.ticket_fee ?? 0, 0);
    return ticketOptions.reduce(
      (total, priceGroup) =>
        total + (ticketQuantities?.[String(priceGroup.id)] ?? 0) * Math.min(priceGroup.price, ticketFee),
      0,
    );
  }, [event.billig?.ticket_fee, ticketOptions, ticketQuantities]);

  function onSubmit(data: BuyTicketFormType): void {
    if (!event.billig?.payment_url) {
      toast.error(t(KEY.common_something_went_wrong));
      return;
    }

    if (data.ticketType === TICKET_TYPE_MEMBERSHIP && !selectedTicketsCanBePutOnCard) {
      toast.error(t(KEY.ticket_card_unavailable_message));
      return;
    }

    const formData = buildBilligFormData({
      ticketQuantities: Object.fromEntries(
        Object.entries(data.ticketQuantities).map(([priceGroupId, quantity]) => [Number(priceGroupId), quantity]),
      ),
      email: data.ticketType === TICKET_TYPE_EMAIL ? data.email : undefined,
      membercard: data.ticketType === TICKET_TYPE_MEMBERSHIP ? data.membershipNumber : undefined,
    });

    sessionStorage.setItem(
      BILLIG_PURCHASE_CONTEXT_KEY,
      JSON.stringify({
        event,
        paymentUrl: event.billig.payment_url,
      }),
    );

    submitBilligForm({
      paymentUrl: event.billig.payment_url,
      formData,
    });
  }

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            try {
              onSubmit(data);
            } catch (error) {
              console.error(error);
              toast.error(t(KEY.common_something_went_wrong));
            }
          })}
        >
          {ticketGroups.map((ticketGroup) => {
            const selectedCountInGroup = selectedTicketCountsByGroup[ticketGroup.id] ?? 0;
            return (
              <div key={ticketGroup.id} className={styles.ticket_group_section}>
                {ticketGroups.length > 1 && <H3 className={styles.ticket_group_title}>{ticketGroup.name}</H3>}
                {ticketGroup.price_groups.map((priceGroup) => {
                  const currentValue = ticketQuantities?.[String(priceGroup.id)] ?? 0;
                  const maxSelectable = Math.min(
                    ticketGroup.per_price_group_limit,
                    currentValue + Math.max(ticketGroup.group_limit - selectedCountInGroup, 0),
                  );

                  return (
                    <div key={priceGroup.id} className={styles.ticket_select}>
                      <div className={styles.select_info}>
                        <p className={styles.select_label}>{priceGroup.name}</p>
                        <p className={styles.price_label}>
                          {priceGroup.price} {t(KEY.kr_per_ticket)}
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name={`ticketQuantities.${priceGroup.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Dropdown
                                options={[...Array(ticketGroup.per_price_group_limit + 1).keys()].map((num) => ({
                                  label: `${num}`,
                                  value: num.toString(),
                                  disabled: num > maxSelectable,
                                }))}
                                value={field.value?.toString() ?? '0'}
                                onChange={(value) => {
                                  if (value) {
                                    form.setValue(`ticketQuantities.${priceGroup.id}`, Number(value));
                                  }
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
              </div>
            );
          })}

          <H3>
            {t(KEY.common_total)}: {totalPrice} NOK
          </H3>
          {totalTicketFee > 0 && <p>{t(KEY.ticket_fee_notice, { fee: totalTicketFee })}</p>}

          <div className={styles.ticket_type}>
            <div className={styles.ticket_type_fields}>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    className={styles.radio_btn}
                    onChange={() => form.setValue('ticketType', TICKET_TYPE_MEMBERSHIP)}
                    checked={ticketType === TICKET_TYPE_MEMBERSHIP}
                    disabled={!selectedTicketsCanBePutOnCard}
                  >
                    {t(KEY.common_membership_number)}
                  </RadioButton>
                  <RadioButton
                    name="ticketType"
                    onChange={() => form.setValue('ticketType', TICKET_TYPE_EMAIL)}
                    checked={ticketType === TICKET_TYPE_EMAIL}
                  >
                    {t(KEY.common_email)}
                  </RadioButton>
                </div>
              </div>

              {!selectedTicketsCanBePutOnCard && ticketOptions.length > 0 && (
                <p className={styles.validation_notice}>{t(KEY.ticket_card_unavailable_message)}</p>
              )}
              {ticketType === TICKET_TYPE_EMAIL && selectedTicketsRequireMembership && (
                <p className={styles.info_notice}>{t(KEY.ticket_requires_membership_message)}</p>
              )}

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

          <Button type="submit" className={styles.pay_button} disabled={form.formState.isSubmitting}>
            {t(KEY.common_to_payment)}
          </Button>
        </form>
      </Form>
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Button,
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
type SeatSelectionMap = Record<string, string>;

const createBuyTicketFormSchema = (t: (key: string) => string) =>
  z
    .object({
      ticketQuantities: z.record(z.string(), z.number().min(0)),
      seatSelections: z.record(z.string(), z.string()).optional(),
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

function parseSeatSelection(rawSelection: string): number[] | null {
  const normalized = rawSelection.trim();
  if (normalized.length === 0) {
    return [];
  }

  const seatIds = normalized
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((seatId) => Number(seatId));

  if (seatIds.some((seatId) => Number.isNaN(seatId) || seatId <= 0)) {
    return null;
  }

  if (new Set(seatIds).size !== seatIds.length) {
    return null;
  }

  return seatIds;
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

  const seatSelectionDefaults = useMemo(
    () =>
      ticketGroups
        .filter((ticketGroup) => ticketGroup.is_theater_ticket_group)
        .reduce((acc, ticketGroup) => {
          acc[String(ticketGroup.id)] = '';
          return acc;
        }, {} as SeatSelectionMap),
    [ticketGroups],
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
      seatSelections: {
        ...seatSelectionDefaults,
        ...(initialValues?.seatSelections ?? {}),
      },
      ticketType:
        eventCanUseMembershipCard && initialValues?.ticketType !== TICKET_TYPE_EMAIL
          ? TICKET_TYPE_MEMBERSHIP
          : TICKET_TYPE_EMAIL,
      email: initialValues?.email ?? '',
      membershipNumber: initialValues?.membershipNumber ?? '',
    }),
    [eventCanUseMembershipCard, initialValues, seatSelectionDefaults, ticketQuantityDefaults],
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
  const selectedTheaterGroups = useMemo(
    () =>
      ticketGroups.filter(
        (ticketGroup) => ticketGroup.is_theater_ticket_group && (selectedTicketCountsByGroup[ticketGroup.id] ?? 0) > 0,
      ),
    [ticketGroups, selectedTicketCountsByGroup],
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
  const totalTicketCount = Object.values(ticketQuantities ?? {}).reduce((total, quantity) => total + quantity, 0);

  function onSubmit(data: BuyTicketFormType): void {
    if (!event.billig?.payment_url) {
      toast.error(t(KEY.common_something_went_wrong));
      return;
    }

    if (data.ticketType === TICKET_TYPE_MEMBERSHIP && !selectedTicketsCanBePutOnCard) {
      toast.error(t(KEY.ticket_card_unavailable_message));
      return;
    }

    const selectedSeats: Record<number, number[]> = {};
    for (const ticketGroup of selectedTheaterGroups) {
      const seatSelection = parseSeatSelection(data.seatSelections?.[String(ticketGroup.id)] ?? '');
      if (seatSelection === null) {
        toast.error(t(KEY.ticket_invalid_seat_selection_message));
        return;
      }
      if (seatSelection.length !== (selectedTicketCountsByGroup[ticketGroup.id] ?? 0)) {
        toast.error(t(KEY.ticket_missing_seat_selection_message));
        return;
      }
      selectedSeats[ticketGroup.id] = seatSelection;
    }

    const formData = buildBilligFormData({
      ticketQuantities: Object.fromEntries(
        Object.entries(data.ticketQuantities).map(([priceGroupId, quantity]) => [Number(priceGroupId), quantity]),
      ),
      selectedSeats: Object.keys(selectedSeats).length > 0 ? selectedSeats : undefined,
      email: data.ticketType === TICKET_TYPE_EMAIL ? data.email : undefined,
      membercard: data.ticketType === TICKET_TYPE_MEMBERSHIP ? data.membershipNumber : undefined,
    });

    sessionStorage.setItem(
      BILLIG_PURCHASE_CONTEXT_KEY,
      JSON.stringify({
        event,
        paymentUrl: event.billig.payment_url,
        selectedSeats,
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
          className={styles.checkout_form}
          onSubmit={form.handleSubmit((data) => {
            try {
              onSubmit(data);
            } catch (error) {
              console.error(error);
              toast.error(t(KEY.common_something_went_wrong));
            }
          })}
        >
          <section className={styles.checkout_section}>
            <div className={styles.section_heading}>
              <span className={styles.step_number}>1</span>
              <H3>{t(KEY.billig_callback_tickets_heading)}</H3>
            </div>

            <div className={styles.ticket_list}>
              {ticketGroups.map((ticketGroup) => {
                const selectedCountInGroup = selectedTicketCountsByGroup[ticketGroup.id] ?? 0;
                return (
                  <div key={ticketGroup.id} className={styles.ticket_group_section}>
                    <div className={styles.ticket_group_heading}>
                      <H3 className={styles.ticket_group_title}>{ticketGroup.name}</H3>
                      <span className={styles.ticket_group_id}>
                        {t(KEY.ticket_group_label, { id: ticketGroup.id })}
                      </span>
                    </div>
                    {ticketGroup.price_groups.map((priceGroup) => {
                      const currentValue = ticketQuantities?.[String(priceGroup.id)] ?? 0;
                      const maxSelectable = Math.min(
                        ticketGroup.per_price_group_limit,
                        currentValue + Math.max(ticketGroup.group_limit - selectedCountInGroup, 0),
                      );

                      return (
                        <div key={priceGroup.id} className={styles.ticket_select}>
                          <p className={styles.select_label}>{priceGroup.name}</p>
                          <p className={styles.price_label}>{priceGroup.price} kr</p>
                          <FormField
                            control={form.control}
                            name={`ticketQuantities.${priceGroup.id}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className={styles.quantity_control}>
                                    <button
                                      type="button"
                                      className={styles.quantity_button}
                                      aria-label={`${priceGroup.name}: -1`}
                                      disabled={currentValue === 0}
                                      onClick={() => field.onChange(Math.max(currentValue - 1, 0))}
                                    >
                                      <span aria-hidden="true">−</span>
                                    </button>
                                    <output className={styles.quantity_value} aria-live="polite">
                                      {currentValue}
                                    </output>
                                    <button
                                      type="button"
                                      className={styles.quantity_button}
                                      aria-label={`${priceGroup.name}: +1`}
                                      disabled={currentValue >= maxSelectable}
                                      onClick={() => field.onChange(Math.min(currentValue + 1, maxSelectable))}
                                    >
                                      <span aria-hidden="true">+</span>
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })}

                    {ticketGroup.is_theater_ticket_group && selectedCountInGroup > 0 && (
                      <div className={styles.seat_selection_block}>
                        <H3 className={styles.seat_selection_title}>{t(KEY.ticket_seat_selection_title)}</H3>
                        <p className={styles.help_text}>
                          {t(KEY.ticket_seat_selection_hint, { count: selectedCountInGroup })}
                        </p>
                        <FormField
                          control={form.control}
                          name={`seatSelections.${ticketGroup.id}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="text"
                                  className={styles.input_field}
                                  placeholder={t(KEY.ticket_seat_selection_placeholder)}
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
                );
              })}
            </div>

            <div className={styles.order_total} aria-live="polite">
              <span className={styles.order_count}>
                {totalTicketCount} {t(KEY.billig_callback_tickets_heading).toLocaleLowerCase()}
              </span>
              <div className={styles.total_breakdown}>
                <strong>
                  {t(KEY.common_total)}: {totalPrice} NOK
                </strong>
                {totalTicketFee > 0 && (
                  <span className={styles.ticket_fee_notice}>{t(KEY.ticket_fee_notice, { fee: totalTicketFee })}</span>
                )}
              </div>
            </div>
          </section>

          <section className={styles.checkout_section}>
            <div className={styles.section_heading}>
              <span className={styles.step_number}>2</span>
              <H3>{t(KEY.common_ticket_type)}</H3>
            </div>

            <div className={styles.ticket_type}>
              <div className={styles.delivery_options}>
                <div className={styles.delivery_option}>
                  <RadioButton
                    name="ticketType"
                    className={styles.radio_btn}
                    onChange={() => form.setValue('ticketType', TICKET_TYPE_MEMBERSHIP)}
                    checked={ticketType === TICKET_TYPE_MEMBERSHIP}
                    disabled={!selectedTicketsCanBePutOnCard}
                  >
                    {t(KEY.common_membership_number)}
                  </RadioButton>
                </div>
                {!selectedTicketsCanBePutOnCard && ticketOptions.length > 0 && (
                  <p className={styles.disabled_delivery_notice}>{t(KEY.ticket_card_unavailable_message)}</p>
                )}
                <div className={styles.delivery_option}>
                  <RadioButton
                    name="ticketType"
                    className={styles.radio_btn}
                    onChange={() => form.setValue('ticketType', TICKET_TYPE_EMAIL)}
                    checked={ticketType === TICKET_TYPE_EMAIL}
                  >
                    {t(KEY.common_email)}
                  </RadioButton>
                </div>
              </div>

              <div
                className={`${styles.delivery_details} ${
                  ticketType === TICKET_TYPE_MEMBERSHIP ? styles.after_membership : styles.after_email
                }`}
              >
                {ticketType === TICKET_TYPE_EMAIL && selectedTicketsRequireMembership && (
                  <p className={styles.info_notice}>{t(KEY.ticket_requires_membership_message)}</p>
                )}

                {ticketType === TICKET_TYPE_MEMBERSHIP ? (
                  <FormField
                    control={form.control}
                    name="membershipNumber"
                    render={({ field }) => (
                      <FormItem>
                        <label className={styles.field_label} htmlFor="checkout-membership-number">
                          {t(KEY.common_membership_number)}
                        </label>
                        <FormControl>
                          <Input
                            id="checkout-membership-number"
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
                ) : (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label className={styles.field_label} htmlFor="checkout-email">
                          {t(KEY.common_email)}
                        </label>
                        <FormControl>
                          <Input
                            id="checkout-email"
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
                )}

                <div className={styles.delivery_description}>
                  {ticketType === TICKET_TYPE_MEMBERSHIP ? (
                    <>
                      <p className={styles.description_line}>{t(KEY.ticketless_description)}</p>
                      <p className={styles.description_line}>
                        <Trans i18nKey={KEY.ticketless_description_note} components={{ strong: <strong /> }} />
                      </p>
                    </>
                  ) : (
                    <p className={styles.description_line}>{t(KEY.email_ticket_description)}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className={styles.checkout_footer}>
            <div className={styles.purchase_notes}>
              <p className={styles.purchase_note}>{t(KEY.pay_info)}</p>
              <div className={styles.footer_links}>
                <a href={ROUTES.other.stripe_info} target="_blank" className={styles.link} rel="noreferrer">
                  {t(KEY.stripe_info)}
                </a>
                <Link url={INFORMATION_PAGES.informasjon_billetter} target="external" className={styles.terms_link}>
                  {t(KEY.sales_conditions)}
                </Link>
              </div>
            </div>
            <Button type="submit" className={styles.pay_button} disabled={form.formState.isSubmitting}>
              {t(KEY.common_to_payment)}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BuyTicketForm;

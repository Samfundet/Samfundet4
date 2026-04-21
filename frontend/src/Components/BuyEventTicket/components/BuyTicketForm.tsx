import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
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
import { prepareBilligPurchase, submitBilligForm } from '~/apis/billig/billigApi';
import type { BilligPriceGroupDto, BilligTicketGroupDto } from '~/apis/billig/billigDtos';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { INFORMATION_PAGES } from '~/routes/samf-three';
import styles from './BuyTicketModal.module.scss';

const DEFAULT_PRICE_GROUP_LIMIT = 9;
const TICKET_TYPE_EMAIL = 'email';
const TICKET_TYPE_MEMBERSHIP = 'membershipNumber';

type TicketQuantityMap = Record<string, number>;
type SeatSelectionMap = Record<string, string>;
type BilligTicketGroupOption = {
  id: number;
  name: string;
  isTheaterTicketGroup: boolean;
  priceGroups: BilligPriceGroupDto[];
  perPriceGroupLimit: number;
  groupLimit: number;
};

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
}

function toTicketGroups(event: EventDto): BilligTicketGroupOption[] {
  return (
    event.billig?.ticket_groups
      .map((ticketGroup: BilligTicketGroupDto) => {
        const priceGroups = ticketGroup.price_groups.filter((priceGroup) => priceGroup.netsale);
        if (priceGroups.length === 0) {
          return undefined;
        }

        const perPriceGroupLimit = ticketGroup.ticket_limit ?? DEFAULT_PRICE_GROUP_LIMIT;
        const groupLimit = ticketGroup.ticket_limit ?? DEFAULT_PRICE_GROUP_LIMIT * priceGroups.length;

        return {
          id: ticketGroup.id,
          name: ticketGroup.name,
          isTheaterTicketGroup: ticketGroup.is_theater_ticket_group,
          priceGroups,
          perPriceGroupLimit,
          groupLimit,
        };
      })
      .filter((ticketGroup): ticketGroup is BilligTicketGroupOption => ticketGroup !== undefined) ?? []
  );
}

function getSelectedTicketCount(
  ticketGroup: BilligTicketGroupOption,
  ticketQuantities: TicketQuantityMap | undefined,
): number {
  return ticketGroup.priceGroups.reduce(
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

export function BuyTicketForm({ event }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const ticketGroups = useMemo(() => toTicketGroups(event), [event]);
  const ticketOptions = useMemo(
    () =>
      ticketGroups.flatMap((ticketGroup) =>
        ticketGroup.priceGroups.map((priceGroup) => ({
          ...priceGroup,
          ticketGroupId: ticketGroup.id,
        })),
      ),
    [ticketGroups],
  );

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
        .filter((ticketGroup) => ticketGroup.isTheaterTicketGroup)
        .reduce((acc, ticketGroup) => {
          acc[String(ticketGroup.id)] = '';
          return acc;
        }, {} as SeatSelectionMap),
    [ticketGroups],
  );

  const form = useForm<BuyTicketFormType>({
    resolver: zodResolver(createBuyTicketFormSchema(t)),
    defaultValues: {
      ticketQuantities: ticketQuantityDefaults,
      seatSelections: seatSelectionDefaults,
      ticketType: TICKET_TYPE_MEMBERSHIP,
      email: '',
      membershipNumber: '',
    },
  });

  const ticketQuantities = useWatch({ control: form.control, name: 'ticketQuantities' });
  const ticketType = useWatch({ control: form.control, name: 'ticketType' }) ?? TICKET_TYPE_MEMBERSHIP;
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
        (ticketGroup) => ticketGroup.isTheaterTicketGroup && (selectedTicketCountsByGroup[ticketGroup.id] ?? 0) > 0,
      ),
    [ticketGroups, selectedTicketCountsByGroup],
  );
  const selectedTicketsCanBePutOnCard =
    selectedPriceGroups.length === 0 || selectedPriceGroups.every((priceGroup) => priceGroup.can_be_put_on_card);
  const selectedTicketsRequireMembership = selectedPriceGroups.some((priceGroup) => priceGroup.membership_needed);
  const totalPrice = useMemo(
    () =>
      ticketOptions.reduce(
        (total, priceGroup) => total + (ticketQuantities?.[String(priceGroup.id)] ?? 0) * priceGroup.price,
        0,
      ),
    [ticketOptions, ticketQuantities],
  );

  async function onSubmit(data: BuyTicketFormType): Promise<void> {
    if (!event.billig?.id) {
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

    const preparedPurchase = await prepareBilligPurchase({
      eventId: event.billig.id,
      ticketQuantities: Object.fromEntries(
        Object.entries(data.ticketQuantities).map(([priceGroupId, quantity]) => [Number(priceGroupId), quantity]),
      ),
      selectedSeats: Object.keys(selectedSeats).length > 0 ? selectedSeats : undefined,
      email: data.ticketType === TICKET_TYPE_EMAIL ? data.email : undefined,
      membercard: data.ticketType === TICKET_TYPE_MEMBERSHIP ? data.membershipNumber : undefined,
    });

    submitBilligForm({
      paymentUrl: preparedPurchase.payment_url,
      formData: preparedPurchase.form_data,
    });
  }

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            try {
              await onSubmit(data);
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
                {ticketGroup.priceGroups.map((priceGroup) => {
                  const currentValue = ticketQuantities?.[String(priceGroup.id)] ?? 0;
                  const maxSelectable = Math.min(
                    ticketGroup.perPriceGroupLimit,
                    currentValue + Math.max(ticketGroup.groupLimit - selectedCountInGroup, 0),
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
                                options={[...Array(ticketGroup.perPriceGroupLimit + 1).keys()].map((num) => ({
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

                {ticketGroup.isTheaterTicketGroup && selectedCountInGroup > 0 && (
                  <div className={styles.seat_selection_block}>
                    <H3 className={styles.seat_selection_title}>{t(KEY.ticket_seat_selection_title)}</H3>
                    <p className={styles.ticketless_description_p}>
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

          <H3>
            {t(KEY.common_total)}: {totalPrice} NOK{' '}
          </H3>

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

              {!selectedTicketsCanBePutOnCard && selectedPriceGroups.length > 0 && (
                <p className={styles.validation_notice}>{t(KEY.ticket_card_unavailable_message)}</p>
              )}
              {ticketType === TICKET_TYPE_EMAIL && selectedTicketsRequireMembership && (
                <p className={styles.validation_notice}>{t(KEY.ticket_requires_membership_message)}</p>
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

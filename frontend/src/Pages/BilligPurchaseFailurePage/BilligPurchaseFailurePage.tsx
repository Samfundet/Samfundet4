import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { H1, H2, Link, Page } from '~/Components';
import { BuyTicketForm } from '~/Components/BuyEventTicket/components/BuyTicketForm';
import { getEvent } from '~/api';
import { BILLIG_PURCHASE_CONTEXT_KEY, getBilligPurchaseFailure } from '~/apis/billig/billigApi';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './BilligPurchaseFailurePage.module.scss';

type BilligPurchaseContext = {
  event: EventDto;
  paymentUrl: string;
  selectedSeats?: Record<number, number[]>;
};

function loadBilligFormscript() {
  const existingScript = document.querySelector<HTMLScriptElement>('script[data-billig-formscript="true"]');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://billettsalg.samfundet.no/formscript';
  script.async = true;
  script.dataset.billigFormscript = 'true';
  document.body.appendChild(script);
}

function readStoredPurchaseContext(): BilligPurchaseContext | null {
  const raw = sessionStorage.getItem(BILLIG_PURCHASE_CONTEXT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BilligPurchaseContext;
  } catch {
    return null;
  }
}

function toRetryInitialValues(form: HTMLFormElement) {
  const ticketQuantities: Record<string, number> = {};
  const seatSelections: Record<string, string> = {};
  let email = '';
  let membershipNumber = '';

  for (const element of Array.from(form.elements)) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement)) {
      continue;
    }

    if (element.name.startsWith('price_') && element.name.endsWith('_count')) {
      const priceGroupId = element.name.slice('price_'.length, -'_count'.length);
      ticketQuantities[priceGroupId] = Number(element.value || '0');
      continue;
    }

    if (element instanceof HTMLInputElement && element.name.startsWith('seat_') && element.checked) {
      const [, ticketGroupId, seatId] = element.name.split('_');
      seatSelections[ticketGroupId] = seatSelections[ticketGroupId]
        ? `${seatSelections[ticketGroupId]} ${seatId}`
        : seatId;
      continue;
    }

    if (element.name === 'email') {
      email = element.value;
    }
    if (element.name === 'membercard') {
      membershipNumber = element.value;
    }
  }

  return {
    ticketQuantities,
    seatSelections,
    ticketType: membershipNumber ? ('membershipNumber' as const) : ('email' as const),
    membershipNumber,
    email,
  };
}

function BilligSignedFailureForm({
  context,
  onParsedValues,
  t,
}: {
  context: BilligPurchaseContext;
  onParsedValues: (values: ReturnType<typeof toRetryInitialValues>) => void;
  t: (key: string) => string;
}) {
  useEffect(() => {
    const form = document.getElementById('billig-js-retry-form');
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const syncValues = () => {
      onParsedValues(toRetryInitialValues(form));
    };

    syncValues();
    const observer = new MutationObserver(syncValues);
    observer.observe(form, {
      attributes: true,
      subtree: true,
      attributeFilter: ['value', 'checked'],
    });

    loadBilligFormscript();
    const timeoutId = window.setTimeout(syncValues, 400);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [context, onParsedValues]);

  return (
    <>
      <form id="billig-js-retry-form" method="POST" action={context.paymentUrl} className={styles.billigForm}>
        <div className="hidden-if-error">
          <section className={styles.panel}>
            <H2>{t(KEY.billig_callback_retry_heading)}</H2>
            <p className={styles.retryText}>{t(KEY.billig_callback_signed_retry_lead)}</p>
            {context.event.billig?.ticket_groups.map((ticketGroup) => {
              const priceGroups = ticketGroup.price_groups.filter((priceGroup) => priceGroup.netsale);
              if (priceGroups.length === 0) {
                return null;
              }

              const maxCount = ticketGroup.ticket_limit ?? 9;
              return (
                <div key={ticketGroup.id} className={styles.groupSection}>
                  <h3 className={styles.groupTitle}>{ticketGroup.name}</h3>
                  {priceGroups.map((priceGroup) => (
                    <label key={priceGroup.id} className={styles.formRow}>
                      <span>{priceGroup.name}</span>
                      <select name={`price_${priceGroup.id}_count`} defaultValue="0" className={styles.select}>
                        {Array.from({ length: maxCount + 1 }, (_, count) => (
                          <option key={count} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              );
            })}

            <label className={styles.formRow}>
              <span>{t(KEY.common_membership_number)}</span>
              <input name="membercard" type="text" className={styles.input} defaultValue="" />
            </label>

            <label className={styles.formRow}>
              <span>{t(KEY.common_email)}</span>
              <input name="email" type="email" className={styles.input} defaultValue="" />
            </label>

            {Object.entries(context.selectedSeats ?? {}).flatMap(([ticketGroupId, seatIds]) =>
              seatIds.map((seatId) => (
                <input
                  key={`${ticketGroupId}-${seatId}`}
                  name={`seat_${ticketGroupId}_${seatId}`}
                  type="checkbox"
                  value="1"
                  defaultChecked
                  hidden
                />
              )),
            )}

            <button type="submit" className={styles.retryButton}>
              {t(KEY.common_to_payment)}
            </button>
          </section>
        </div>
      </form>

      <div id="dynamic-error" className={styles.dynamicError} style={{ display: 'none' }} />

      <section className={`${styles.panel} shown-if-error`} style={{ display: 'none' }}>
        <H2>{t(KEY.billig_callback_non_retryable_heading)}</H2>
        <p>{t(KEY.billig_callback_non_retryable_description)}</p>
      </section>
    </>
  );
}

export function BilligPurchaseFailurePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bsession = searchParams.get('bsession') ?? '';
  const [storedContext, setStoredContext] = useState<BilligPurchaseContext | null>(null);
  const [signedRetryValues, setSignedRetryValues] = useState<ReturnType<typeof toRetryInitialValues> | undefined>();

  useEffect(() => {
    setStoredContext(readStoredPurchaseContext());
  }, []);

  const { data: failureData, isLoading: isFailureLoading } = useQuery({
    queryKey: ['billig-purchase-failure', bsession],
    queryFn: () => getBilligPurchaseFailure(bsession),
    enabled: bsession.length > 0,
  });

  const dbRetryInitialValues = useMemo(
    () =>
      failureData
        ? {
            ticketQuantities: Object.fromEntries(
              failureData.cart_rows.map((row) => [String(row.price_group), row.number_of_tickets]),
            ),
            ticketType: failureData.owner_cardno ? ('membershipNumber' as const) : ('email' as const),
            membershipNumber: failureData.owner_cardno ?? '',
            email: failureData.owner_email ?? '',
          }
        : undefined,
    [failureData],
  );

  const { data: dbRetryEvent } = useQuery({
    queryKey: ['billig-purchase-failure-event', failureData?.event_id],
    queryFn: () => getEvent(failureData?.event_id as number),
    enabled: Boolean(!storedContext?.event && failureData?.retry_possible && failureData?.event_id),
  });

  const shouldUseSignedMode = Boolean(window.location.hash) && Boolean(storedContext?.event?.billig);
  const retryEvent = storedContext?.event ?? dbRetryEvent;

  return (
    <Page className={styles.page} loading={isFailureLoading}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <H1>{t(KEY.billig_callback_failure_title)}</H1>
          <H2 className={styles.subheading}>{t(KEY.billig_callback_failure_lead)}</H2>
        </header>

        {!shouldUseSignedMode && (
          <section className={styles.errorPanel}>
            <H2>{t(KEY.billig_callback_error_heading)}</H2>
            <div id="dynamic-error" className={styles.errorMessage}>
              {failureData?.message ?? t(KEY.common_something_went_wrong)}
            </div>
          </section>
        )}

        {shouldUseSignedMode && storedContext && (
          <>
            <BilligSignedFailureForm context={storedContext} onParsedValues={setSignedRetryValues} t={t} />
            {signedRetryValues && (
              <section className={`${styles.panel} hidden-if-error`}>
                <H2>{t(KEY.billig_callback_editable_retry_heading)}</H2>
                <p className={styles.retryText}>{t(KEY.billig_callback_editable_retry_lead)}</p>
                <BuyTicketForm event={storedContext.event} initialValues={signedRetryValues} />
              </section>
            )}
          </>
        )}

        {!shouldUseSignedMode && failureData?.found && failureData.retry_possible && retryEvent && (
          <section className={styles.panel}>
            <H2>{t(KEY.billig_callback_retry_heading)}</H2>
            <p className={styles.retryText}>{t(KEY.billig_callback_retry_lead)}</p>
            <BuyTicketForm event={retryEvent} initialValues={dbRetryInitialValues} />
          </section>
        )}

        {!shouldUseSignedMode && !failureData?.found && (
          <section className={styles.panel}>
            <p>{t(KEY.billig_callback_missing_error_session)}</p>
          </section>
        )}

        {!shouldUseSignedMode && failureData?.found && !failureData.retry_possible && (
          <section className={styles.panel}>
            <p>{t(KEY.billig_callback_non_retryable_description)}</p>
          </section>
        )}

        <section className={styles.panel}>
          <H2>{t(KEY.billig_callback_back_heading)}</H2>
          {retryEvent ? (
            <Link url={`/events/${retryEvent.id}/`}>{t(KEY.billig_callback_back_to_event)}</Link>
          ) : (
            <Link url="/events/">{t(KEY.billig_callback_back_to_events)}</Link>
          )}
        </section>
      </div>
    </Page>
  );
}

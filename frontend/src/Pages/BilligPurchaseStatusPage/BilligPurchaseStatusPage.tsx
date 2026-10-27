import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Button, H1, H2, Link, Page } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './BilligPurchaseStatusPage.module.scss';

declare global {
  interface Window {
    ticket_callback?: (payload: BilligCallbackPayload) => void;
  }
}

type BilligCallbackPayload = {
  tickets: Array<{
    ticketno: string;
    price_group: number;
    on_card: boolean;
  }>;
  price_groups: Record<number, { name: string; event: number; price: number }>;
  events: Record<number, { name: string; timestamp: number }>;
};

type TicketDetails = {
  ticketno: string;
  on_card: boolean | null;
  price_group_name: string | null;
  price: number | null;
  event_name: string | null;
};

function buildPdfUrl(ticketRefs: string[]): string | null {
  if (ticketRefs.length === 0) {
    return null;
  }

  const query = new URLSearchParams(ticketRefs.map((ticketRef, index) => [`ticket${index}`, ticketRef]));
  return `https://billig.samfundet.no/pdf?${query}`;
}

const CALLBACK_TIMEOUT_MS = 15_000;

function loadBilligFormscript(onError: () => void) {
  const script = document.createElement('script');
  script.src = 'https://billettsalg.samfundet.no/formscript';
  script.async = true;
  script.dataset.billigFormscript = 'true';
  script.onerror = onError;
  document.body.appendChild(script);
  return script;
}

export function BilligPurchaseStatusPage() {
  const { t } = useTranslation();
  const { tickets = '' } = useParams();
  const normalizedTickets = useMemo(() => tickets.replace(/\/+$/, ''), [tickets]);
  const [callbackPayload, setCallbackPayload] = useState<BilligCallbackPayload | null>(null);
  const [callbackFailed, setCallbackFailed] = useState(false);

  const plainTicketRefs = useMemo(
    () => normalizedTickets.split(',').filter((ticket) => /^\d+$/.test(ticket)),
    [normalizedTickets],
  );
  const usesJavascriptCallback = useMemo(
    () => normalizedTickets.split(',').some((ticket) => ticket.startsWith('e')),
    [normalizedTickets],
  );

  useEffect(() => {
    setCallbackPayload(null);
    setCallbackFailed(false);
    if (!usesJavascriptCallback) {
      return;
    }

    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      setCallbackFailed(true);
    };
    const timeout = window.setTimeout(fail, CALLBACK_TIMEOUT_MS);
    window.ticket_callback = (payload: BilligCallbackPayload) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      setCallbackPayload(payload);
    };
    const script = loadBilligFormscript(fail);

    return () => {
      settled = true;
      window.clearTimeout(timeout);
      script.onerror = null;
      script.remove();
      window.ticket_callback = undefined;
    };
  }, [usesJavascriptCallback]);

  const callbackTickets: TicketDetails[] | undefined = callbackPayload?.tickets.map((ticket) => {
    const priceGroup = callbackPayload.price_groups[ticket.price_group];
    const event = priceGroup ? callbackPayload.events[priceGroup.event] : undefined;
    return {
      ticketno: ticket.ticketno,
      on_card: ticket.on_card,
      price_group_name: priceGroup?.name ?? null,
      price: priceGroup?.price ?? null,
      event_name: event?.name ?? null,
    };
  });

  const ticketsToDisplay: TicketDetails[] | null =
    callbackTickets ??
    (plainTicketRefs.length > 0
      ? plainTicketRefs.map((ticketno) => ({
          ticketno,
          on_card: null,
          price_group_name: null,
          price: null,
          event_name: null,
        }))
      : null);
  const pdfUrl = buildPdfUrl(ticketsToDisplay?.map((ticket) => ticket.ticketno) ?? []);
  const totalPrice = callbackTickets?.reduce((sum, ticket) => sum + (ticket.price ?? 0), 0);
  const isLoading = usesJavascriptCallback && callbackPayload === null && !callbackFailed;

  return (
    <Page className={styles.page} loading={isLoading}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <H1>{t(KEY.billig_callback_status_title)}</H1>
          <p className={styles.lead}>{t(KEY.billig_callback_status_lead)}</p>
        </header>

        {ticketsToDisplay && (
          <>
            <section className={styles.panel}>
              <H2>{t(KEY.billig_callback_tickets_heading)}</H2>
              <div className={styles.ticketList}>
                {ticketsToDisplay.map((ticket) => (
                  <article key={ticket.ticketno} className={styles.ticketRow}>
                    <div>
                      <div className={styles.ticketRef}>
                        {t(KEY.billig_callback_ticket_reference)}: {ticket.ticketno}
                      </div>
                      <div className={styles.ticketMeta}>
                        {[
                          ticket.event_name,
                          ticket.price_group_name,
                          ticket.on_card === true
                            ? t(KEY.billig_callback_on_card)
                            : ticket.on_card === false
                              ? t(KEY.billig_callback_email_delivery)
                              : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    </div>
                    <div className={styles.ticketPrice}>{ticket.price ? `${ticket.price} kr` : ''}</div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <H2>{t(KEY.billig_callback_summary_heading)}</H2>
              <div className={styles.summaryRow}>
                <span>{t(KEY.billig_callback_ticket_count)}</span>
                <strong>{ticketsToDisplay.length}</strong>
              </div>
              {totalPrice !== undefined && (
                <div className={styles.summaryRow}>
                  <span>{t(KEY.billig_callback_total_price)}</span>
                  <strong>{totalPrice} kr</strong>
                </div>
              )}
              {pdfUrl && (
                <Link url={pdfUrl} target="external" className={styles.downloadLink}>
                  {t(KEY.billig_callback_download_pdf)}
                </Link>
              )}
            </section>
          </>
        )}

        {callbackFailed && (
          <section className={styles.panel} role="alert">
            <H2>{t(KEY.billig_callback_tickets_heading)}</H2>
            <p>{t(KEY.billig_callback_load_failed)}</p>
            <Button onClick={() => window.location.reload()}>{t(KEY.ticket_checkout_retry)}</Button>
          </section>
        )}

        {!ticketsToDisplay && !isLoading && !callbackFailed && (
          <section className={styles.panel}>
            <H2>{t(KEY.billig_callback_tickets_heading)}</H2>
            <p>{t(KEY.billig_callback_missing_ticket_details)}</p>
          </section>
        )}
      </div>
    </Page>
  );
}

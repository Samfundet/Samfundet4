import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { H1, H2, Link, Page } from '~/Components';
import { getBilligPurchaseSuccess } from '~/apis/billig/billigApi';
import type { BilligPurchaseSuccessDto } from '~/apis/billig/billigDtos';
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

export function BilligPurchaseStatusPage() {
  const { t } = useTranslation();
  const { tickets = '' } = useParams();
  const normalizedTickets = useMemo(() => tickets.replace(/\/+$/, ''), [tickets]);
  const [callbackPayload, setCallbackPayload] = useState<BilligCallbackPayload | null>(null);

  const plainTicketRefs = useMemo(
    () => normalizedTickets.split(',').filter((ticket) => ticket && !ticket.startsWith('e')),
    [normalizedTickets],
  );
  const usesJavascriptCallback = useMemo(
    () => normalizedTickets.split(',').some((ticket) => ticket.startsWith('e')),
    [normalizedTickets],
  );

  useEffect(() => {
    if (!usesJavascriptCallback) {
      return;
    }

    window.ticket_callback = (payload: BilligCallbackPayload) => {
      setCallbackPayload(payload);
    };
    loadBilligFormscript();

    return () => {
      delete window.ticket_callback;
    };
  }, [usesJavascriptCallback]);

  const { data, isLoading } = useQuery({
    queryKey: ['billig-purchase-success', normalizedTickets],
    queryFn: () => getBilligPurchaseSuccess(plainTicketRefs.join(',')),
    enabled: plainTicketRefs.length > 0,
  });

  const callbackTickets = callbackPayload?.tickets.map((ticket) => {
    const priceGroup = callbackPayload.price_groups[ticket.price_group];
    const event = priceGroup ? callbackPayload.events[priceGroup.event] : undefined;
    return {
      ticketno: ticket.ticketno,
      on_card: ticket.on_card,
      price_group_name: priceGroup?.name ?? null,
      price: priceGroup?.price ?? null,
      event_name: event?.name ?? null,
      event_time: event ? new Date(event.timestamp * 1000).toISOString() : null,
    };
  });

  const content: BilligPurchaseSuccessDto | null =
    data ??
    (callbackTickets
      ? {
          tickets: callbackTickets.map((ticket) => ({
            ticketno: ticket.ticketno,
            on_card: ticket.on_card,
            price_group: null,
            price_group_name: ticket.price_group_name,
            price: ticket.price,
            event: null,
            event_name: ticket.event_name,
            event_time: ticket.event_time,
          })),
          total_price: callbackTickets.reduce((sum, ticket) => sum + (ticket.price ?? 0), 0),
          pdf_url: null,
        }
      : null);

  return (
    <Page className={styles.page} loading={isLoading && !content}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <H1>{t(KEY.billig_callback_status_title)}</H1>
          <p className={styles.lead}>{t(KEY.billig_callback_status_lead)}</p>
        </header>

        {content && (
          <>
            <section className={styles.panel}>
              <H2>{t(KEY.billig_callback_tickets_heading)}</H2>
              <div className={styles.ticketList}>
                {content.tickets.map((ticket) => (
                  <article key={ticket.ticketno} className={styles.ticketRow}>
                    <div>
                      <div className={styles.ticketRef}>{ticket.ticketno}</div>
                      <div className={styles.ticketMeta}>
                        {[
                          ticket.event_name,
                          ticket.price_group_name,
                          ticket.on_card ? t(KEY.billig_callback_on_card) : t(KEY.billig_callback_email_delivery),
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
                <strong>{content.tickets.length}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>{t(KEY.billig_callback_total_price)}</span>
                <strong>{content.total_price} kr</strong>
              </div>
              {content.pdf_url && (
                <Link url={content.pdf_url} target="external" className={styles.downloadLink}>
                  {t(KEY.billig_callback_download_pdf)}
                </Link>
              )}
            </section>
          </>
        )}

        {!content && !isLoading && (
          <section className={styles.panel}>
            <H2>{t(KEY.billig_callback_tickets_heading)}</H2>
            <p>{t(KEY.billig_callback_missing_ticket_details)}</p>
          </section>
        )}
      </div>
    </Page>
  );
}

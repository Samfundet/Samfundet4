import { Carousel, ImageCard } from '~/Components';
import { BuyEventTicket } from '~/Components/BuyEventTicket/BuyEventTicket';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto, HomePageElementDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventCarousel.module.scss';

type EventCarouselProps = {
  skeletonCount?: number;
  element?: HomePageElementDto;
};

const spacing = 1.5;

export function EventCarousel({ element, skeletonCount = 0 }: EventCarouselProps) {
  const wrapperClass = styles.wrapper;

  if (!element) {
    return (
      <Carousel className={wrapperClass} spacing={spacing}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value we can use here
          <ImageCard key={i} isSkeleton />
        ))}
      </Carousel>
    );
  }

  return (
    <Carousel className={wrapperClass} header={element.title_nb} spacing={spacing}>
      {element.events.map((event: EventDto) => {
        const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } });
        const event_title = dbT(event, 'title') ?? '';
        const event_short_dsc = dbT(event, 'description_short') ?? '';

        return (
          <ImageCard
            className={styles.image_card}
            key={event.id}
            id={event.id.toString()}
            title={event_title}
            subtitle={event.location}
            date={event.start_dt}
            imageUrl={BACKEND_DOMAIN + event.image_url}
            description={event_short_dsc}
            url={url}
            ticket_type={event.ticket_type}
            host={event.host}
          >
            {event.billig && <BuyEventTicket event={event} ticketSaleState={event.billig} />}
          </ImageCard>
        );
      })}
    </Carousel>
  );
}

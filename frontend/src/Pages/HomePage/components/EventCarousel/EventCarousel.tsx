import { Carousel, EventCard, ImageCard } from '~/Components';
import type { EventDto, HomePageElementDto } from '~/dto';
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
      {element.events.map((event: EventDto) => (
        <EventCard event={event} key={event.id} />
      ))}
    </Carousel>
  );
}

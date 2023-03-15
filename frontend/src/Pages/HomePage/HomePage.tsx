import { reverse } from '~/named-urls';
import { useEffect, useState } from 'react';
import { getEventsUpcomming } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { Carousel } from '~/Components/Carousel';
import { ContentCard } from '~/Components/ContentCard';
import { ImageCard } from '~/Components/ImageCard';
import { SplashHeaderBox } from '~/Components/SplashHeaderBox';
import { EventDto } from '~/dto';
import { Children } from '~/types';
import styles from './HomePage.module.scss';
import { ROUTES } from '~/routes';

export function HomePage() {
  const [events, setEvents] = useState<EventDto[]>([]);

  useEffect(() => {
    getEventsUpcomming().then((events: EventDto[]) => {
      setEvents(events);
    });
  }, []);

  function eventCategories(): string[] {
    return Array.from(new Set(events.map((e) => e.category)));
  }

  function eventsByCategory(category: string): Children[] {
    const filteredEvents = events.filter((e) => e.category === category);
    return filteredEvents.map((event) => {
      const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })
      return (
        <ImageCard
          key={event.id}
          title={event.title_en}
          date={new Date().toString()}
          imageUrl={event.image_url}
          url={url}
        />
      );
    });
  }

  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        <SplashHeaderBox />

        <div style={{ height: '1em' }} />

        {eventCategories().map((category: string) => (
          <Carousel key={category} header={category} spacing={1.5}>
            {eventsByCategory(category)}
          </Carousel>
        ))}

        {/* Below is just demo stuff until API integration is fully done */}

        <ContentCard />

        {['Testarr'].map((name) => (
          <Carousel header={name} spacing={1.5} key={name}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <ImageCard key={num} title={'Kultur ' + num} />
            ))}
          </Carousel>
        ))}

        <ContentCard />

        {['Andre arrangementer', 'Flere arrangementer'].map((name) => (
          <Carousel header={name} spacing={1.5} key={name}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <ImageCard key={num} title={'Annet ' + num} />
            ))}
          </Carousel>
        ))}

        <ContentCard />

        <div className={styles.inner_content}></div>
      </div>
    </div>
  );
}

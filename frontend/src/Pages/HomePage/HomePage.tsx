import { reverse } from '~/named-urls';
import { useEffect, useState } from 'react';
import { getHomeData } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { Carousel } from '~/Components/Carousel';
import { ContentCard } from '~/Components/ContentCard';
import { ImageCard } from '~/Components/ImageCard';
import { EventDto, HomePageElementDto } from '~/dto';
import { Children } from '~/types';
import styles from './HomePage.module.scss';
import { ROUTES } from '~/routes';
import { dbT } from '~/i18n/i18n';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const [elements, setHomeElements] = useState<HomePageElementDto[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    getHomeData().then((elements: HomePageElementDto[]) => {
      setHomeElements(elements);
    });
  }, []);

  function renderLargeCard(element: HomePageElementDto): Children {
    const event = element.events[0];
    const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } });
    return (
      <ContentCard
        title={dbT(element, 'title', i18n.language) as string}
        description={dbT(element, 'description', i18n.language) as string}
        imageUrl={event.image_url}
        url={url}
        buttonText=""
      />
    );
  }

  function renderCarousel(element: HomePageElementDto): Children {
    return (
      <Carousel header={element.title_nb} spacing={1.5}>
        {element.events.map((event: EventDto) => {
          const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } });
          return (
            <ImageCard
              key={event.id}
              title={event.title_en}
              date={event.start_dt}
              imageUrl={event.image_url}
              url={url}
            />
          );
        })}
      </Carousel>
    );
  }

  function renderElement(element: HomePageElementDto): Children | null {
    switch (element.variation) {
      case 'carousel':
        return renderCarousel(element);
      case 'large-card':
        return renderLargeCard(element);
    }
    console.log(`Unknown home page element kind '${element.variation}'`);
    return null;
  }

  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        {/*<SplashHeaderBox />*/}
        {elements.map((el: HomePageElementDto) => renderElement(el))}
      </div>
    </div>
  );
}

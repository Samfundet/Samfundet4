import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHomeData } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { useAuthContext } from '~/AuthContext';
import { IconButton } from '~/Components';
import { Carousel } from '~/Components/Carousel';
import { ContentCard } from '~/Components/ContentCard';
import { ImageCard } from '~/Components/ImageCard';
import { EventDto, HomePageElementDto } from '~/dto';
import { dbT } from '~/i18n/i18n';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { Children, COLORS } from '~/types';
import { hasPerm } from '~/utils';
import styles from './HomePage.module.scss';

export function HomePage() {
  const [elements, setHomeElements] = useState<HomePageElementDto[]>([]);
  const { i18n } = useTranslation();
  const { user } = useAuthContext();
  const isStaff = user?.is_staff;

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
          const editUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: event.id } });
          const detailurl = reverse({
            pattern: ROUTES.backend.admin__samfundet_event_change,
            urlParams: { objectId: event.id },
          });
          const canChangeEvent = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: event.id });

          return (
            <ImageCard
              className={styles.image_card}
              key={event.id}
              title={event.title_en}
              date={event.start_dt}
              imageUrl={event.image_url}
              url={url}
            >
              <div className={styles.button_bar}>
                {canChangeEvent && <IconButton icon="mdi:pen" url={editUrl} title="Edit" color={COLORS.blue} />}
                {isStaff && canChangeEvent && (
                  <IconButton
                    icon="vscode-icons:file-type-django"
                    title="Backend details"
                    target="backend"
                    color={COLORS.white}
                    border="solid green 1px"
                    url={detailurl}
                  />
                )}
              </div>
            </ImageCard>
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

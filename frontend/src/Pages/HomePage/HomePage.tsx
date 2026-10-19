import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { EventCardContainer } from '~/Components';
import { Infobox } from '~/Components/Infobox/Infobox';
import { LargeCard } from '~/Pages/HomePage/components';
import { getHomeData } from '~/api';
import type { HomePageDto, HomePageElementDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT, imageUrl } from '~/utils';
import styles from './HomePage.module.scss';
import { Splash } from './components/Splash/Splash';

export function HomePage() {
  const [homePage, setHomePage] = useState<HomePageDto>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useTitle('');

  useEffect(() => {
    getHomeData()
      .then((page: HomePageDto) => {
        setHomePage(page);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, [t]);

  function renderElement(key: number, element: HomePageElementDto): ReactNode {
    switch (element.variation) {
      case 'infobox': {
        if (element.infoboxes.length === 0) return <div key={key} />;
        return (
          <div className={styles.infobox_row} key={key}>
            {element.infoboxes.map((ib) => (
              <Infobox
                key={ib.id}
                title={dbT(ib, 'title') ?? ''}
                infoTxt={dbT(ib, 'text') ?? ''}
                bgColor={ib.color}
                img={ib.image ? imageUrl(ib.image, 'small') : undefined}
                infoURL={ib.url ?? undefined}
              />
            ))}
          </div>
        );
      }
      case 'carousel': {
        if (element.events.length > 0) {
          return <EventCardContainer title={dbT(element, 'title')} events={element.events} key={key} />;
        }
        return <div key={key} />;
      }
      case 'large-card':
        return <LargeCard key={key} element={element} />;
    }
    console.error(`Unknown home page element kind '${element.variation}'`);
  }

  const skeleton = (
    <>
      <LargeCard />
      <EventCardContainer events={[]} skeletonCount={6} />
    </>
  );

  return (
    <>
      <Splash events={homePage?.splash} showInfo={true} />
      <div className={styles.content}>
        {/*<SplashHeaderBox />*/}
        {isLoading && skeleton}

        {homePage?.elements.map((el, index) => renderElement(index, el))}
      </div>
    </>
  );
}

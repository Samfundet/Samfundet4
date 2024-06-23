import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { EventCarousel, LargeCard } from '~/Pages/HomePage/components';
import { getHomeData } from '~/api';
import type { HomePageDto, HomePageElementDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import type { Children } from '~/types';
import styles from './HomePage.module.scss';
import { Splash } from './components/Splash/Splash';

export function HomePage() {
  const [homePage, setHomePage] = useState<HomePageDto>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

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

  function renderElement(key: number, element: HomePageElementDto): Children {
    switch (element.variation) {
      case 'carousel': {
        if (element.events.length > 0) return <EventCarousel key={key} element={element} />;
        return <div key={key}></div>;
      }
      case 'large-card':
        return <LargeCard key={key} element={element} />;
    }
    console.error(`Unknown home page element kind '${element.variation}'`);
    return <div key={key}></div>;
  }

  const skeleton = (
    <>
      <LargeCard />
      <EventCarousel skeletonCount={6} />
    </>
  );

  return (
    <div>
      <Splash events={homePage?.splash} showInfo={true} />
      <div className={styles.content}>
        {/*<SplashHeaderBox />*/}
        {isLoading && skeleton}

        {/* Render elements for frontpage. */}
        {homePage?.elements.map((el, index) => renderElement(index, el))}
      </div>
    </div>
  );
}

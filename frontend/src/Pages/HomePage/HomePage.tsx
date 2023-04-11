import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ToggleSwitch } from '~/Components';
import { useGlobalContext } from '~/GlobalContextProvider';
import { EventCarousel, LargeCard } from '~/Pages/HomePage/components';
import { getHomeData } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { HomePageElementDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { Children } from '~/types';
import styles from './HomePage.module.scss';

export function HomePage() {
  const [elements, setHomeElements] = useState<HomePageElementDto[]>([]);
  const { t } = useTranslation();

  const { mirrorDimension, toggleMirrorDimension, isMouseTrail, toggleMouseTrail } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHomeData()
      .then((elements: HomePageElementDto[]) => {
        setHomeElements(elements);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, [t]);

  function renderElement(key: number, element: HomePageElementDto): Children {
    switch (element.variation) {
      case 'carousel':
        return <EventCarousel key={key} element={element} />;
      case 'large-card':
        return <LargeCard key={key} element={element} />;
    }
    console.error(`Unknown home page element kind '${element.variation}'`);
    return <></>;
  }

  const skeleton = (
    <>
      <LargeCard />
      <EventCarousel skeletonCount={6} />
    </>
  );

  return (
    <>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        {/*<SplashHeaderBox />*/}

        {/* Toggle mirror dimension, TODO: move to PreferencePage. */}
        <ToggleSwitch checked={mirrorDimension} onChange={toggleMirrorDimension} />
        <ToggleSwitch checked={isMouseTrail} onChange={toggleMouseTrail} />

        {isLoading && skeleton}

        {/* Render elements for frontpage. */}
        {elements.map((el: HomePageElementDto, index) => renderElement(index, el))}
      </div>
    </>
  );
}

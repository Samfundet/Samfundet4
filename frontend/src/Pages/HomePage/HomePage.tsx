import { useEffect, useState } from 'react';
import { getHomeData } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { ToggleSwitch } from '~/Components';
import { HomePageElementDto } from '~/dto';
import { useGlobalContext } from '~/GlobalContextProvider';
import { EventCarousel, LargeCard } from '~/Pages/HomePage/components';
import { Children } from '~/types';
import styles from './HomePage.module.scss';

export function HomePage() {
  const [elements, setHomeElements] = useState<HomePageElementDto[]>([]);

  const { mirrorDimension, toggleMirrorDimension } = useGlobalContext();

  useEffect(() => {
    getHomeData().then((elements: HomePageElementDto[]) => {
      setHomeElements(elements);
    });
  }, []);

  function renderElement(key: number, element: HomePageElementDto): Children | undefined {
    switch (element.variation) {
      case 'carousel':
        return <EventCarousel key={key} element={element} />;
      case 'large-card':
        return <LargeCard key={key} element={element} />;

        console.log(`Unknown home page element kind '${element.variation}'`);
        return undefined;
    }
  }

  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        {/*<SplashHeaderBox />*/}
        <ToggleSwitch checked={mirrorDimension} onChange={toggleMirrorDimension} />
        {elements.map((el: HomePageElementDto, index) => renderElement(index, el))}
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { EventCardContainer } from '~/Components';
import { LargeCard } from '~/Pages/HomePage/components';
import { getHomeData } from '~/api';
import { eventKeys } from '~/domain';
import type { HomePageElementDto } from '~/dto';
import { useTitle } from '~/hooks';
import { dbT } from '~/utils';
import styles from './HomePage.module.scss';
import { Splash } from './components/Splash/Splash';

export function HomePage() {
  const { data: homePage, isLoading } = useQuery({
    queryKey: eventKeys.home(),
    queryFn: getHomeData,
  });

  useTitle('');

  function renderElement(key: number, element: HomePageElementDto): ReactNode {
    switch (element.variation) {
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

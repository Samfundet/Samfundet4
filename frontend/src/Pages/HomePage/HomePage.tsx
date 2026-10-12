import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { EventCardContainer } from '~/Components';
import { LargeCard } from '~/Pages/HomePage/components';
import { type HomePageElementDto, useGetHomeData } from '~/domain';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './HomePage.module.scss';
import { Splash } from './components/Splash/Splash';

export function HomePage() {
  const { data: homePage, isError, error } = useGetHomeData();
  const { t } = useTranslation();

  useTitle('');

  useEffect(() => {
    if (isError) {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(error);
    }
  }, [isError, error, t]);

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
        {!homePage && skeleton}

        {homePage?.elements.map((el, index) => renderElement(index, el))}
      </div>
    </>
  );
}

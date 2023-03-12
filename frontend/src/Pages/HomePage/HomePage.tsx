import splash from '~/assets/banner-sample.jpg';
import { Carousel } from '~/Components/Carousel';
import { ContentCard } from '~/Components/ContentCard';
import { ImageCard } from '~/Components/ImageCard';
import { SplashHeaderBox } from '~/Components/SplashHeaderBox';
import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        <SplashHeaderBox />

        <div style={{ height: '1em' }} />

        {/* Below is just demo stuff until API integration is done */}

        {['Konserter'].map((name) => (
          <Carousel header={name} spacing={1.5} key={name}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <ImageCard key={num} title={'Konsert ' + num} date={new Date().toString()} />
            ))}
          </Carousel>
        ))}

        <ContentCard />

        {['Kulturarrangementer'].map((name) => (
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

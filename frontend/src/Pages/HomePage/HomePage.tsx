import { getCsrfToken, getSaksdokumenter, getUser, login, logout } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { useAuthContext } from '~/AuthContext';
import { Button } from '~/Components';
import { Carousel } from '~/Components/Carousel';
import { ImageCard } from '~/Components/ImageCard';
import { SplashHeaderBox } from '~/Components/SplashHeaderBox';
import { SAMFUNDET_ADD_EVENT } from '~/permissions';
import { hasPerm } from '~/utils';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { setUser } = useAuthContext();
  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        <SplashHeaderBox />

        <div style={{ height: '1em' }} />

        {['Konserter', 'Kulturarrangementer', 'Andre arrangementer', 'Flere arrangementer'].map((name) => (
          <Carousel header={name} spacing={1.5} key={name}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <ImageCard key={num} />
            ))}
          </Carousel>
        ))}

        <div className={styles.inner_content}></div>
      </div>
    </div>
  );
}

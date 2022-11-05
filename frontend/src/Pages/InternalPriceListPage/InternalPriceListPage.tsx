import logo from '~/assets/logo_black.png';
import splash from '~/assets/splash.jpeg';
import styles from './InternalPriceListPage.module.scss';

export function InternalPriceListPage() {
  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.content}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>Velkommen til Samfundet og MG::Web!</h1>
        <p>Hello World</p>
      </div>
    </div>
  );
}

import logo from '../../assets/logo_black.png';
import splash from '../../assets/splash.jpeg';
import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.content}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>Velkommen til Samfundet og MG::Web!</h1>
        <p>
          Gratulerer! Du har nå fått tutorial-prosjektet opp å kjøre, og alt ser ut til å fungere som det skal! Det
          første som er smart å gjøre er å utforske koden og bli litt kjent med hvordan ting er satt opp.
        </p>
      </div>
    </div>
  );
}

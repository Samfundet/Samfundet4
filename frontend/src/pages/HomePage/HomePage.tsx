import logo from '../../assets/logo_black.png';
import splash from '../../assets/splash.jpeg';
import styles from './HomePage.module.scss';

import { Link } from 'react-router-dom';

export function HomePage() {
  const txt = [
    `
            Gratulerer! Du har nå fått tutorial-prosjektet opp å kjøre, og alt ser ut til å fungere som det skal! 
            Det første som er smart å gjøre er å utforske koden og bli litt kjent med hvordan ting er satt opp.
        `,
    `
            Tutorial-prosjektet er veldig likt hvordan selve samfundet.no skal implementeres, 
            men denne løsningen er selvfølgelig ganske tom per nå. Det blir det din jobb å fikse!
        `,
    `
            Målet med dette prosjektet er å sette opp en fungerende arrangement-side. Da vil du få erfaring med
            hele stacken til prosjektet - både backend og frontend - og du vil være forberedt til
            å jobbe med den faktiske siden etterpå!
        `,
  ];

  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.content}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>{`Velkommen til Samfundet og MG::Web!`}</h1>
        {txt.map((x) => (
          <p key={x}>{x}</p>
        ))}
        <Link to="/arrangementer">
          <div className={styles.button}>Til Arrangementer</div>
        </Link>
      </div>
    </div>
  );
}

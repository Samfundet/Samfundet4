import React from 'react';

import styles from './AboutPage.module.scss';
import button from '../../Components/Button/Button.module.scss';
import runderode from '../../assets/runderode.jpg';
import splash from '../../assets/splash.jpeg';
import { Button } from 'Components';

export function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <img src={runderode} alt="Runderode" className={styles.runderode} />
        <div className={styles.aboutText}>
          <h2>Om Samfundet</h2>
          <p>
            Studentersamfundet i Trondhjem er en organisasjon for studenter i Trondheim som eies og drives av sine rundt
            16 100 medlemmer. Formålsparagrafen vår sier at ”Studentersamfundet skal være det naturlige samlingsstedet
            for studenter i Trondhjem”. Vårt røde runde huser konserter, ulike kulturarrangementer, utallige barer, en
            kafé og en restaurant. Mest sagnomsust er Samfundsmøtene, viet til debatt om politikk og aktuelle spørsmål,
            eller til underholdning og moro. Samfundet har også tre av Trondheims beste konsertscener.
          </p>
          <Button>MEDLEMSKAP</Button>
          <Button>FAQ</Button>
          <Button>KONTAKTINFO</Button>
          <Button>BILLETTER</Button>
        </div>
      </div>

      <div className={styles.samfundsmote}>
        <h2>Samfundsmøtet</h2>
        <p>
          Samfundsmøtet er Studentersamfundets høyeste organ. Her velges leder samt medlemmer til Finansstyret og Rådet.
          Lederen velger ut sitt eget styre, som utformer den politiske profilen og representer medlemmene og foreningen
          Samfundet. Finansstyret administrerer forretningsdriften. Rådet kontrollerer at all virksomhet i Samfundet
          foregår i henhold til norske og interne lover. Samfundet har en daglig leder, økonomiansvarlig, husøkonom,
          vaktmester og renholdspersonell som er ansatte.
        </p>
        <button className={button.button_samf}>SAMFUNDET SOM ORGANISASJON</button>
        <button className={button.button_secondary}>SAKSDOKUMENTER</button>
        <button className={button.button_samf}>SAMFUNDETS HISTORIE</button>
      </div>
      <div className={styles.moreInfo}>
        <div className={styles.volunteer}>
          <img src={splash} alt="Splash" className={styles.splash} />
          <h2>Frivilligheten</h2>
          <p>
            Det meste av arbeid på Studentersamfundet i Trondhjem gjøres gjennom dugnad av studenter. Arbeidet er
            organisert i enheter som kalles gjenger. Potensielle nye medlemmer må søke den aktuelle gjengen om opptak,
            og gjengen vurderer hver enkelt søker. Med sine omtrent 1700 frivillige utgjør det indre miljøet i
            Studentersamfundet en betydelig del av det organiserte fritidstilbudet til studenter i Trondheim.
          </p>
          <button className={button.button_samf}>Gjenge på Samfundet</button>
          <button className={button.button_samf}>Opptak</button>
        </div>
        <div className={styles.moreInfoRight}>
          <div className={styles.festival}>
            <h2>UKA og ISFiT</h2>
            <p>
              Annenhvert år arrangeres Norges største kulturfestival UKA og verdens største internasjonale tematiske
              studentfestival under Studentersamfundets paraply.
            </p>
            <Button>UKA</Button>
            <Button>ISFiT</Button>
          </div>
          <div className={styles.otherInfo}>
            <h2>Annen info</h2>
            <Button>Aldersgrenser</Button>
            <Button>Booking</Button>
            <Button>Quiz</Button>
            <Button>Leie og tjenester</Button>
            <Button>Presse</Button>
            <Button>Filmklubben</Button>
            <Button>Personvern</Button>
            <Button>Tilrettelegging</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

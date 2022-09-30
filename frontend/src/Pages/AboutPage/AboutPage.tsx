import React from 'react';

import styles from './AboutPage.module.scss';
import runderode from '../../assets/runderode.jpg';

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
      </div>
    </div>
  );
}

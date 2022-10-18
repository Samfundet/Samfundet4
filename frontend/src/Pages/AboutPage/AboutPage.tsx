import styles from './AboutPage.module.scss';
import bodegaen from '../../assets/bodegaen.jpg';
import daglighallen from '../../assets/daglighallen.jpg';
import edgar from '../../assets/edgar.jpg';
import klubben from '../../assets/klubben.jpg';
import knaus from '../../assets/knaus.jpg';
import lyche from '../../assets/lyche.jpg';
import runderode from '../../assets/runderode.jpg';
import rundhallen from '../../assets/rundhallen.jpg';
import selskapssiden from '../../assets/selskapssiden.jpg';
import splash from '../../assets/splash.jpeg';
import storsalen from '../../assets/storsalen.jpg';
import strossa from '../../assets/strossa.jpg';
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
        <Button>SAMFUNDET SOM ORGANISASJON</Button>
        <Button theme="secondary">SAKSDOKUMENTER</Button>
        <Button theme="secondary">SAMFUNDETS HISTORIE</Button>
      </div>
      <div className={styles.venues}>
        <h1>LOKALER</h1>
        <a href="/about/storsalen">
          <img src={storsalen} alt="Storsalen" className={styles.venueImg}></img>
          <h3>Storsalen</h3>
        </a>
        <a href="/about/bodegaen">
          <img src={bodegaen} alt="Bodegaen" className={styles.venueImg}></img>
          <h3>Bodegaen</h3>
        </a>
        <a href="/about/klubben">
          <img src={klubben} alt="Klubben" className={styles.venueImg}></img>
          <h3>Klubben</h3>
        </a>
        <a href="/about/strossa">
          <img src={strossa} alt="Strossa" className={styles.venueImg}></img>
          <h3>Strossa</h3>
        </a>
        <a href="/about/selskapssiden">
          <img src={selskapssiden} alt="Selskapssiden" className={styles.venueImg}></img>
          <h3>Selskapssiden</h3>
        </a>
        <a href="/about/knaus">
          <img src={knaus} alt="Knaus" className={styles.venueImg}></img>
          <h3>Knaus</h3>
        </a>
        <a href="/about/edgar">
          <img src={edgar} alt="Edgar" className={styles.venueImg}></img>
          <h3>Edgar</h3>
        </a>
        <a href="/lyche">
          <img src={lyche} alt="Lyche" className={styles.venueImg}></img>
          <h3>Lyche</h3>
        </a>
        <a href="/about/daglighallen">
          <img src={daglighallen} alt="Daglighallen" className={styles.venueImg}></img>
          <h3>Daglighallen</h3>
        </a>
        <a href="/about/rundhallen">
          <img src={rundhallen} alt="Rundhallen" className={styles.venueImg}></img>
          <h3>Rundhallen</h3>
        </a>
      </div>
      <div className={styles.mapButton}>
        <Button theme="secondary">OVERSIKTSKART</Button>
        <Button theme="secondary">NYBYGG</Button>
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
          <Button theme="secondary">GJENGENE PÅ SAMFUNDET</Button>
          <Button theme="secondary">OPPTAK</Button>
        </div>
        <div className={styles.moreInfoRight}>
          <div className={styles.festival}>
            <h2>UKA & ISFiT</h2>
            <p>
              Annenhvert år arrangeres Norges største kulturfestival UKA og verdens største internasjonale tematiske
              studentfestival under Studentersamfundets paraply.
            </p>
            <Button>UKA</Button>
            <Button>ISFiT</Button>
          </div>
          <div className={styles.otherInfo}>
            <h2>Annen info</h2>
            <Button theme="secondary">Aldersgrenser</Button>
            <Button theme="secondary">Booking</Button>
            <Button theme="secondary">Quiz</Button>
            <Button theme="secondary">Leie og tjenester</Button>
            <Button theme="secondary">Presse</Button>
            <Button theme="secondary">Filmklubben</Button>
            <Button theme="secondary">Personvern</Button>
            <Button theme="secondary">Tilrettelegging</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

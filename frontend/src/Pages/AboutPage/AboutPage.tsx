import styles from './AboutPage.module.scss';
import { Button } from 'Components';
import { ROUTES } from 'routes';

export function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <img src={require('../../assets/runderode.jpg')} alt="Runderode" className={styles.runderode} />
        <div className={styles.aboutText}>
          <h2>Om Samfundet</h2>
          <p>
            Studentersamfundet i Trondhjem er en organisasjon for studenter i Trondheim som eies og drives av sine rundt
            16 100 medlemmer. Formålsparagrafen vår sier at ”Studentersamfundet skal være det naturlige samlingsstedet
            for studenter i Trondhjem”. Vårt røde runde huser konserter, ulike kulturarrangementer, utallige barer, en
            kafé og en restaurant. Mest sagnomsust er Samfundsmøtene, viet til debatt om politikk og aktuelle spørsmål,
            eller til underholdning og moro. Samfundet har også tre av Trondheims beste konsertscener.
          </p>
          <Button className={styles.button}>MEDLEMSKAP</Button>
          <Button className={styles.button}>FAQ</Button>
          <Button className={styles.button}>KONTAKTINFO</Button>
          <Button className={styles.button}>BILLETTER</Button>
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
        <Button className={styles.button}>SAMFUNDET SOM ORGANISASJON</Button>
        <Button className={styles.button} theme="secondary">
          SAKSDOKUMENTER
        </Button>
        <Button className={styles.button} theme="secondary">
          SAMFUNDETS HISTORIE
        </Button>
      </div>
      <div className={styles.venues}>
        <h1>LOKALER</h1>
        <a href={ROUTES.frontend.storsalen}>
          <img src={require('../../assets/storsalen.jpg')} alt="Storsalen" className={styles.venueImg}></img>
          <h3>Storsalen</h3>
        </a>
        <a href={ROUTES.frontend.bodegaen}>
          <img src={require('../../assets/bodegaen.jpg')} alt="Bodegaen" className={styles.venueImg}></img>
          <h3>Bodegaen</h3>
        </a>
        <a href={ROUTES.frontend.klubben}>
          <img src={require('../../assets/klubben.jpg')} alt="Klubben" className={styles.venueImg}></img>
          <h3>Klubben</h3>
        </a>
        <a href={ROUTES.frontend.strossa}>
          <img src={require('../../assets/strossa.jpg')} alt="Strossa" className={styles.venueImg}></img>
          <h3>Strossa</h3>
        </a>
        <a href={ROUTES.frontend.selskapssiden}>
          <img src={require('../../assets/selskapssiden.jpg')} alt="Selskapssiden" className={styles.venueImg}></img>
          <h3>Selskapssiden</h3>
        </a>
        <a href={ROUTES.frontend.knaus}>
          <img src={require('../../assets/knaus.jpg')} alt="Knaus" className={styles.venueImg}></img>
          <h3>Knaus</h3>
        </a>
        <a href={ROUTES.frontend.edgar}>
          <img src={require('../../assets/edgar.jpg')} alt="Edgar" className={styles.venueImg}></img>
          <h3>Edgar</h3>
        </a>
        <a href={ROUTES.frontend.lyche}>
          <img src={require('../../assets/lyche.jpg')} alt="Lyche" className={styles.venueImg}></img>
          <h3>Lyche</h3>
        </a>
        <a href={ROUTES.frontend.daglighallen}>
          <img src={require('../../assets/daglighallen.jpg')} alt="Daglighallen" className={styles.venueImg}></img>
          <h3>Daglighallen</h3>
        </a>
        <a href={ROUTES.frontend.rundhallen}>
          <img src={require('../../assets/rundhallen.jpg')} alt="Rundhallen" className={styles.venueImg}></img>
          <h3>Rundhallen</h3>
        </a>
      </div>
      <div>
        <Button className={styles.button} theme="secondary">
          OVERSIKTSKART
        </Button>
        <Button className={styles.button} theme="secondary">
          NYBYGG
        </Button>
      </div>
      <div className={styles.moreInfo}>
        <div className={styles.volunteer}>
          <img src={require('../../assets/splash.jpeg')} alt="Splash" className={styles.splash} />
          <div className={styles.volunteerText}>
            <h2>Frivilligheten</h2>
            <p>
              Det meste av arbeid på Studentersamfundet i Trondhjem gjøres gjennom dugnad av studenter. Arbeidet er
              organisert i enheter som kalles gjenger. Potensielle nye medlemmer må søke den aktuelle gjengen om opptak,
              og gjengen vurderer hver enkelt søker. Med sine omtrent 1700 frivillige utgjør det indre miljøet i
              Studentersamfundet en betydelig del av det organiserte fritidstilbudet til studenter i Trondheim.
            </p>
            <Button className={styles.button} theme="secondary">
              GJENGENE PÅ SAMFUNDET
            </Button>
            <Button className={styles.button} theme="secondary">
              OPPTAK
            </Button>
          </div>
        </div>
        <div className={styles.moreInfoRight}>
          <div className={styles.festival}>
            <h2>UKA & ISFiT</h2>
            <p>
              Annenhvert år arrangeres Norges største kulturfestival UKA og verdens største internasjonale tematiske
              studentfestival under Studentersamfundets paraply.
            </p>
            <Button className={styles.button}>UKA</Button>
            <Button className={styles.button}>ISFiT</Button>
          </div>
          <div className={styles.otherInfo}>
            <h2>Annen info</h2>
            <Button className={styles.button} theme="secondary">
              Aldersgrenser
            </Button>
            <Button className={styles.button} theme="secondary">
              Booking
            </Button>
            <Button className={styles.button} theme="secondary">
              Quiz
            </Button>
            <Button className={styles.button} theme="secondary">
              Leie og tjenester
            </Button>
            <Button className={styles.button} theme="secondary">
              Presse
            </Button>
            <Button className={styles.button} theme="secondary">
              Filmklubben
            </Button>
            <Button className={styles.button} theme="secondary">
              Personvern
            </Button>
            <Button className={styles.button} theme="secondary">
              Tilrettelegging
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

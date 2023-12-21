import classNames from 'classnames';
import { Button, Carousel } from '~/Components';
import { Page } from '~/Components/Page';
import { runderode, splash } from '~/assets';
import { ROUTES } from '~/routes';
import { backgroundImageFromUrl } from '~/utils';
import styles from './AboutPage.module.scss';
import { VENUES } from './data';

export function AboutPage() {
  return (
    <Page>
      <div className={styles.row}>
        <img src={runderode} alt="Runderode" className={classNames(styles.runderode, styles.box)} />
        <div className={styles.textBox}>
          <h2 className={styles.header}>Om Samfundet</h2>
          <p className={styles.text}>
            Studentersamfundet i Trondhjem er en organisasjon for studenter i Trondheim som eies og drives av sine rundt
            16 100 medlemmer. Formålsparagrafen vår sier at ”Studentersamfundet skal være det naturlige samlingsstedet
            for studenter i Trondhjem”. Vårt røde runde huser konserter, ulike kulturarrangementer, utallige barer, en
            kafé og en restaurant. Mest sagnomsust er Samfundsmøtene, viet til debatt om politikk og aktuelle spørsmål,
            eller til underholdning og moro. Samfundet har også tre av Trondheims beste konsertscener.
          </p>
          <Button theme="samf" className={styles.button}>
            MEDLEMSKAP
          </Button>
          <Button theme="success" className={styles.button}>
            FAQ
          </Button>
          <Button theme="blue" className={styles.button}>
            KONTAKTINFO
          </Button>
          <Button theme="outlined" className={styles.button}>
            BILLETTER
          </Button>
        </div>
      </div>
      <div className={classNames(styles.box, styles.textBox)}>
        <h2 className={styles.header}>Samfundsmøtet</h2>
        <p className={styles.text}>
          Samfundsmøtet er Studentersamfundets høyeste organ. Her velges leder samt medlemmer til Finansstyret og Rådet.
          Lederen velger ut sitt eget styre, som utformer den politiske profilen og representer medlemmene og foreningen
          Samfundet. Finansstyret administrerer forretningsdriften. Rådet kontrollerer at all virksomhet i Samfundet
          foregår i henhold til norske og interne lover. Samfundet har en daglig leder, økonomiansvarlig, husøkonom,
          vaktmester og renholdspersonell som er ansatte.
        </p>
        <Button theme="samf" className={styles.button}>
          SAMFUNDET SOM ORGANISASJON
        </Button>
        <Button className={styles.button} theme="outlined">
          SAKSDOKUMENTER
        </Button>
        <Button className={styles.button} theme="outlined">
          SAMFUNDETS HISTORIE
        </Button>
      </div>
      <h2 className={styles.header2}>Lokaler</h2>

      <Carousel spacing={1.5} header>
        {VENUES.images.map((image, idx) => {
          return (
            <div key={idx}>
              <div className={styles.venue_bubble} style={backgroundImageFromUrl(image.src)}></div>
              <div className={styles.venue_name}>{image.name}</div>
            </div>
          );
        })}
      </Carousel>

      <div className={styles.row}>
        <Button className={styles.button} theme="outlined">
          OVERSIKTSKART
        </Button>
        <Button className={styles.button} theme="outlined">
          NYBYGG
        </Button>
      </div>
      <div className={styles.row}>
        <div className={styles.image_box}>
          <img src={splash} alt="Splash" className={styles.splash} />
          <div className={styles.textBox}>
            <h2 className={styles.header}>Frivilligheten</h2>
            <p className={styles.text}>
              Det meste av arbeid på Studentersamfundet i Trondhjem gjøres gjennom dugnad av studenter. Arbeidet er
              organisert i enheter som kalles gjenger. Potensielle nye medlemmer må søke den aktuelle gjengen om opptak,
              og gjengen vurderer hver enkelt søker. Med sine omtrent 1700 frivillige utgjør det indre miljøet i
              Studentersamfundet en betydelig del av det organiserte fritidstilbudet til studenter i Trondheim.
            </p>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="basic" link={ROUTES.frontend.groups}>
                GJENGENE PÅ SAMFUNDET
              </Button>
              <Button className={styles.tableButton} theme="basic">
                OPPTAK
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.uka_isfit}>
            <h3 className={styles.header_col}>UKA & ISFiT</h3>
            <p className={styles.text}>
              Annenhvert år arrangeres Norges største kulturfestival UKA og verdens største internasjonale tematiske
              studentfestival under Studentersamfundets paraply.
            </p>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="samf">
                UKA
              </Button>
              <Button className={styles.tableButton} theme="blue">
                ISFiT
              </Button>
            </div>
          </div>
          <div className={styles.other_info}>
            <h3 className={styles.header_col}>Annen Info</h3>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="basic">
                Aldersgrenser
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Booking
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Quiz
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Leie og tjenester
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Presse
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Filmklubb
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Personvern
              </Button>
              <Button className={styles.tableButton} theme="basic">
                Tilrettelegning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

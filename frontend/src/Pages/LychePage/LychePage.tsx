import { useEffect, useState } from 'react';
import { SultenCard } from '~/Components/SultenCard';
import { SultenPage } from '~/Components/SultenPage';
import { getMenus, getVenues } from '~/api';
import { front_lyche, sulten_chef, sulten_crowded, sulten_delivery, sulten_inside } from '~/assets';
import { MenuDto, VenueDto } from '~/dto';
import styles from './LychePage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function LychePage() {
  const [lycheVenue, setLycheVenue] = useState<VenueDto>();
  const [lycheMenu, setLycheMenu] = useState<MenuDto>();
  useEffect(() => {
    getVenues()
      .then((data) => {
        const lyche = data.find((venue) => venue.name?.toLowerCase() === 'lyche');
        setLycheVenue(lyche);
      })
      .catch(console.error);
    getMenus()
      .then((data) => {
        const menu = data.find((menu) => menu.name_nb?.toLowerCase() === 'lyche');
        setLycheMenu(menu);
      })
      .catch(console.error);
  }, []);
  const openingHours = (
    <div className={styles.opening_hour_container}>
      <h2 className={styles.opening_hour_header}>ÅPNINGSTIDER</h2>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>Man-Tor</p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_monday} -{lycheVenue?.closing_monday}
        </p>
      </div>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>Fre-Lør</p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_friday} -{lycheVenue?.closing_friday}
        </p>
      </div>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>Søndag</p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_monday} -{lycheVenue?.closing_sunday}
        </p>
      </div>
    </div>
  );

  const reservationCard = (
    <SultenCard
      image={sulten_inside}
      imageAlt={'Bilde av Lyche'}
      header={'Reservation'}
      text={'Vil du reservere bord på Lyche? Dette kan du gjøre gjennom vårt reservasjonssystem, eller på epost. '}
      buttonText={'Reserver bord'}
      imageAlignment="left"
    />
  );

  const menuCard = (
    <SultenCard
      image={sulten_delivery}
      imageAlt={'Food delivery'}
      header={'Meny'}
      text={
        'Hos Lyche ønsker vi å legge vekt på mat og drikke av høy kvalitet. Dette gjelder både å ha et variert men også godt gjennomtenkt utvalg.'
      }
      buttonText={'Se vår meny'}
      imageAlignment="right"
    />
  );

  const aboutSultenCard = (
    <SultenCard
      image={sulten_chef}
      imageAlt={'Lyche Chef'}
      header={'Om lyche'}
      text={
        'Lyche er en restaurant drevet på frivillig basis. Alle servitørene og kokkene på kjøkkenet jobber frivillig, og vi er en del av Kafé og serveringsgjengen (KSG) ved Studentersamfundet i Trondhjem.'
      }
      buttonText={'Mer om oss'}
      imageAlignment="left"
    />
  );

  const ContactCard = (
    <SultenCard
      image={sulten_crowded}
      imageAlt={'Bilde av Lyche'}
      header={'Kontakt'}
      text={
        'Har du spørsmål, henvendelser, forslag til forbedring eller av andre årsaker ønsker å komme i kontakt med oss? Her finner du kontaktinformasjonen vår.'
      }
      buttonText={'Kontakt oss'}
      imageAlignment="right"
    />
  );

  return (
    <SultenPage>
      <div className={styles.image_container}>
        <img src={front_lyche} alt="Lyche" className={styles.background_image} />
        {openingHours}
      </div>
      <div className={styles.content_container}>
        <h1>LychePage</h1>
      </div>
      {reservationCard}
      {menuCard}
      {aboutSultenCard}
      {ContactCard}
    </SultenPage>
  );
}

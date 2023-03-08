import { useEffect, useState } from 'react';
import { SultenPage } from '~/Components/SultenPage';
import { getMenus, getVenues } from '~/api';
import { front_lyche } from '~/assets';
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

  return (
    <SultenPage>
      <div className={styles.image_container}>
        <img src={front_lyche} alt="Lyche" className={styles.background_image} />
        {openingHours}
      </div>
      <div className={styles.content_container}>
        <h1>LychePage</h1>
      </div>
    </SultenPage>
  );
}

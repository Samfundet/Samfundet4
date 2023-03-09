import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SultenCard } from '~/Components/SultenCard';
import { SultenPage } from '~/Components/SultenPage';
import { getVenues } from '~/api';
import { front_lyche, sulten_chef, sulten_crowded, sulten_delivery, sulten_inside } from '~/assets';
import { VenueDto } from '~/dto';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LychePage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function LychePage() {
  const [lycheVenue, setLycheVenue] = useState<VenueDto>();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();

  useEffect(() => {
    getVenues()
      .then((data) => {
        const lyche = data.find((venue) => venue.name?.toLowerCase() === 'lyche');
        setLycheVenue(lyche);
      })
      .catch(console.error);
  }, []);

  const openingHours = (
    <div className={styles.opening_hour_container}>
      <h2 className={styles.opening_hour_header}>{t(KEY.opening_hours)}</h2>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>
          {t(KEY.day_monday)}-{t(KEY.day_thursday)}
        </p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_monday?.substring(0, 5)}-{lycheVenue?.closing_monday?.substring(0, 5)}
        </p>
      </div>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>
          {t(KEY.day_friday)}-{t(KEY.day_saturday)}
        </p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_friday?.substring(0, 5)}-{lycheVenue?.closing_friday?.substring(0, 5)}
        </p>
      </div>
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>{t(KEY.day_sunday)}</p>
        <p className={styles.hour_item}>
          {lycheVenue?.opening_sunday?.substring(0, 5)}-{lycheVenue?.closing_sunday?.substring(0, 5)}
        </p>
      </div>
    </div>
  );

  const reservationCard = (
    <SultenCard
      image={sulten_inside}
      imageAlt={t(KEY.sulten)}
      header={t(KEY.common_reservations)}
      text={useTextItem('sulten_reservation_text', i18n)}
      buttonText={t(KEY.sulten_book_table) || undefined}
      imageAlignment="left"
      onButtonClick={() => navigate(ROUTES.frontend.sulten_reservation)}
    />
  );

  const menuCard = (
    <SultenCard
      image={sulten_delivery}
      imageAlt={'Food delivery'}
      header={t(KEY.common_menu)}
      text={useTextItem('sulten_menu_text', i18n)}
      buttonText={t(KEY.sulten_see_menu) || undefined}
      imageAlignment="right"
      onButtonClick={() => navigate(ROUTES.frontend.sulten_menu)}
    />
  );

  const aboutSultenCard = (
    <SultenCard
      image={sulten_chef}
      imageAlt={'Chef'}
      header={t(KEY.sulten_about_us)}
      text={useTextItem('sulten_about_us_text', i18n)}
      buttonText={t(KEY.sulten_more_about_us) || undefined}
      imageAlignment="left"
      onButtonClick={() => navigate(ROUTES.frontend.sulten_about)}
    />
  );

  const ContactCard = (
    <SultenCard
      image={sulten_crowded}
      imageAlt={t(KEY.sulten)}
      header={t(KEY.common_contact)}
      text={useTextItem('sulten_contact_text', i18n)}
      buttonText={t(KEY.common_contact_us) || undefined}
      imageAlignment="right"
      onButtonClick={() => navigate(ROUTES.frontend.sulten_contact)}
    />
  );

  return (
    <>
      <div className={styles.image_container}>
        <img src={front_lyche} alt="Lyche" className={styles.background_image} />
        {openingHours}
      </div>
      <SultenPage>
        <div className={styles.content_container}>
          <h1>LychePage</h1>
        </div>
        {reservationCard}
        {menuCard}
        {aboutSultenCard}
        {ContactCard}
      </SultenPage>
    </>
  );
}

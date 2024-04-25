import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SultenCard } from '~/Components';
import { SultenPage } from '~/Components/SultenPage';
import { getVenues } from '~/api';
import { front_lyche, sulten_chef, sulten_crowded, sulten_delivery, sulten_inside } from '~/assets';
import { TextItem, VENUE } from '~/constants';
import { VenueDto } from '~/dto';
import { useTextItem, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LycheHomePage.module.scss';
import { getIsConsistentWeekdayOpeningHours, getIsConsistentWeekendHours } from './utils';

export function LycheHomePage() {
  const [lycheVenue, setLycheVenue] = useState<VenueDto>();
  const { t } = useTranslation();
  const [isConsistentWeekdayHours, setIsConsistentWeekdayHours] = useState(false);
  const [isConsistentWeekendHours, setIsConsistentWeekendHours] = useState(false);
  const [loading, setLoading] = useState(true);
  useTitle(t(KEY.common_sulten));

  useEffect(() => {
    getVenues()
      .then((data) => {
        const lyche = data.find((venue) => venue.name?.toLowerCase() === VENUE.LYCHE);
        setLycheVenue(lyche);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsConsistentWeekdayHours(getIsConsistentWeekdayOpeningHours(lycheVenue));
    setIsConsistentWeekendHours(getIsConsistentWeekendHours(lycheVenue));
  }, [lycheVenue]);

  const openingHourRow = (days: string, open_hour: string | undefined, close_hour: string | undefined) => {
    return (
      <div className={styles.hour_item_container}>
        <p className={styles.hour_item}>{days}</p>
        <p className={styles.hour_item}>{`${open_hour?.substring(0, 5)}-${close_hour?.substring(0, 5)}`}</p>
      </div>
    );
  };

  const openingHours = !loading && (
    <div className={styles.opening_hour_container}>
      <h2 className={styles.opening_hour_header}>{t(KEY.common_opening_hours)}</h2>

      {/* Weekday hours */}
      {isConsistentWeekdayHours ? (
        <>
          {openingHourRow(
            `${t(KEY.common_day_monday)}-${t(KEY.common_day_thursday)}`,
            lycheVenue?.opening_monday,
            lycheVenue?.closing_monday,
          )}
        </>
      ) : (
        <>
          {openingHourRow(`${t(KEY.common_day_monday)}`, lycheVenue?.opening_monday, lycheVenue?.closing_monday)}
          {openingHourRow(`${t(KEY.common_day_tuesday)}`, lycheVenue?.opening_tuesday, lycheVenue?.closing_tuesday)}
          {openingHourRow(
            `${t(KEY.common_day_wednesday)}`,
            lycheVenue?.opening_wednesday,
            lycheVenue?.closing_wednesday,
          )}
          {openingHourRow(`${t(KEY.common_day_thursday)}`, lycheVenue?.opening_thursday, lycheVenue?.closing_thursday)}
        </>
      )}

      {/* Weekend hours */}
      {isConsistentWeekendHours ? (
        <>
          {openingHourRow(
            `${t(KEY.common_day_friday)}-${t(KEY.common_day_saturday)}`,
            lycheVenue?.opening_friday,
            lycheVenue?.closing_friday,
          )}
        </>
      ) : (
        <>
          {openingHourRow(`${t(KEY.common_day_friday)}`, lycheVenue?.opening_friday, lycheVenue?.closing_friday)}
          {openingHourRow(`${t(KEY.common_day_saturday)}`, lycheVenue?.opening_saturday, lycheVenue?.closing_saturday)}
        </>
      )}

      {/* Sunday hours */}
      {openingHourRow(`${t(KEY.common_day_sunday)}`, lycheVenue?.opening_sunday, lycheVenue?.closing_sunday)}
    </div>
  );

  const reservationCard = (
    <SultenCard
      image={sulten_inside}
      imageAlt={t(KEY.common_sulten)}
      header={t(KEY.common_reservation)}
      text={useTextItem(TextItem.sulten_reservation_text)}
      buttonText={t(KEY.sulten_page_book_table) || undefined}
      imageAlignment="left"
      link={ROUTES.frontend.sulten_reservation}
    />
  );

  const menuCard = (
    <SultenCard
      image={sulten_delivery}
      imageAlt={'Food delivery'}
      header={t(KEY.common_menu)}
      text={useTextItem(TextItem.sulten_menu_text)}
      buttonText={t(KEY.sulten_page_see_menu) || undefined}
      imageAlignment="right"
      link={ROUTES.frontend.sulten_menu}
    />
  );

  const aboutSultenCard = (
    <SultenCard
      image={sulten_chef}
      imageAlt={'Chef'}
      header={t(KEY.sulten_page_about_us)}
      text={useTextItem(TextItem.sulten_about_us_text)}
      buttonText={t(KEY.sulten_page_more_about_us) || undefined}
      imageAlignment="left"
      link={ROUTES.frontend.sulten_about}
    />
  );

  const ContactCard = (
    <SultenCard
      image={sulten_crowded}
      imageAlt={t(KEY.common_sulten)}
      header={t(KEY.common_contact)}
      text={useTextItem(TextItem.sulten_contact_text)}
      buttonText={t(KEY.common_contact_us) || undefined}
      imageAlignment="right"
      link={ROUTES.frontend.sulten_contact}
    />
  );

  return (
    <>
      <div className={styles.image_container}>
        <img src={front_lyche} alt="Lyche" className={styles.background_image} />
        {openingHours}
      </div>
      <SultenPage>
        <div className={styles.card_container}>
          {reservationCard}
          {menuCard}
          {aboutSultenCard}
          {ContactCard}
        </div>
      </SultenPage>
    </>
  );
}

import { useTranslation } from 'react-i18next';
import { SultenPage } from '~/Components/SultenPage';
import { useTextItem } from '~/hooks'; // endre??
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { ROUTES } from '~/routes';
import styles from './LycheAboutPage.module.scss';
import { useState, useEffect } from 'react';
import { getVenues } from '~/api';
import { VenueDto } from '~/dto';
import { TextItem, VENUE } from '~/constants';
import { SultenCard } from '~/Components';
import { sulten_chef } from '~/assets';

export function LycheAboutPage() {
  // const [lycheVenue, setLycheVenue] = useState<VenueDto>();
  // const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  // useEffect(() => {
  //   getVenues()
  //     .then((data) => {
  //       const lyche = data.find((venue) => venue.name?.toLowerCase() === VENUE.LYCHE);
  //       setLycheVenue(lyche);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       toast.error(t(KEY.common_something_went_wrong));
  //       console.error(error);
  //     });
  //   // HUH?
  // }, []);
  const aboutPageSultenCard = (
    <SultenCard
      image={sulten_chef}
      imageAlt={'Chef'}
      header={t(KEY.sulten_page_about_us)} //hva er lyche
      // text={useTextItem(TextItem.sulten_about_page_text)}
      text="Lyche er en restaurant og spritbar som drives utelukkende av 
      frivillige studenter. Om lag 100 engasjerte amatører jobber som kokker og 
      barservitører og gjør sitt beste for at du som gjest skal få en hyggelig opplevelse. "
      imageAlignment="right"
      smallCard={true}
    />
  );
  //bilder fra foto?
  return (
    <SultenPage>
      <div className={styles.card_container}>
        {aboutPageSultenCard}
        {aboutPageSultenCard}
      </div>
    </SultenPage>
  );
}

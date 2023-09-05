import { useTranslation } from 'react-i18next';

import { SultenPage } from '~/Components/SultenPage';
import { useTextItem } from '~/hooks'; // endre??
import { KEY } from '~/i18n/constants';
// import { toast } from 'react-toastify';
// import { ROUTES } from '~/routes';
import styles from './LycheAboutPage.module.scss';
// import { useState, useEffect } from 'react';
// import { getVenues } from '~/api';
// import { VenueDto } from '~/dto';
import { TextItem } from '~/constants';
import { SultenCard } from '~/Components';
import { burger, soup, dessert } from '~/assets';

export function LycheAboutPage() {
  const { t } = useTranslation();

  const aboutCard1 = (
    <SultenCard
      image={soup}
      imageAlt={'Chef'}
      header={t(KEY.sulten_what_is_lyche)} //hva er lyche
      text={useTextItem(TextItem.sulten_what_is_lyche_text)}
      imageAlignment="right"
      smallCard={true}
    />
  );
  const aboutCard2 = (
    <SultenCard
      image={burger}
      imageAlt={'Chef'}
      header={t(KEY.sulten_lyche_goal)} //hva er lyche
      text={useTextItem(TextItem.sulten_lyche_goal_text)}
      imageAlignment="left"
      smallCard={true}
    />
  );
  const aboutCard3 = (
    <SultenCard
      image={dessert}
      imageAlt={'Chef'}
      header={t(KEY.sulten_lyche_about_menu)} //hva er lyche
      text={useTextItem(TextItem.sulten_lyche_about_menu_text)}
      imageAlignment="right"
      smallCard={true}
    />
  );

  return (
    <>
      <SultenPage>
        <div className={styles.container}>
          {aboutCard1}
          {aboutCard2}
          {aboutCard3}
        </div>
      </SultenPage>
    </>
  );
}

import { useTranslation } from 'react-i18next';
import { SultenCard } from '~/Components';
import { SultenPage } from '~/Components/SultenPage';
import { burger, dessert, soup } from '~/assets';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './LycheAboutPage.module.scss';

export function LycheAboutPage() {
  const { t } = useTranslation();

  const aboutCardWhatIsLyche = (
    <SultenCard
      image={soup}
      imageAlt={'Chef'}
      header={t(KEY.sulten_what_is_lyche)}
      text={useTextItem(TextItem.sulten_what_is_lyche_text)}
      imageAlignment="right"
      smallCard={true}
    />
  );
  const aboutCardLycheGoal = (
    <SultenCard
      image={burger}
      imageAlt={'Chef'}
      header={t(KEY.sulten_lyche_goal)}
      text={useTextItem(TextItem.sulten_lyche_goal_text)}
      imageAlignment="left"
      smallCard={true}
    />
  );
  const aboutCardLycheAboutMenu = (
    <SultenCard
      image={dessert}
      imageAlt={'Chef'}
      header={t(KEY.sulten_lyche_about_menu)}
      text={useTextItem(TextItem.sulten_lyche_about_menu_text)}
      imageAlignment="right"
      smallCard={true}
    />
  );

  return (
    <>
      <SultenPage>
        <div className={styles.container}>
          {aboutCardWhatIsLyche}
          {aboutCardLycheGoal}
          {aboutCardLycheAboutMenu}
        </div>
      </SultenPage>
    </>
  );
}

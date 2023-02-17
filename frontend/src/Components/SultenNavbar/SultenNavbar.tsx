import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { englishFlag, lycheLogo, norwegianFlag } from '~/assets';
import { useDesktop } from '~/hooks';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SultenNavbar.module.scss';

export function SultenNavbar() {
  const { t, i18n } = useTranslation();
  const isDesktop = useDesktop();
  const [showMobileNavigation, setMobileNavigation] = useState(false);
  const isNorwegian = i18n.language == LANGUAGES.NB;

  const itemStyling = classNames({
    [styles.item]: isDesktop,
    [styles.mobile_item]: !isDesktop,
  });

  const leftItems = (
    <>
      <Link to={ROUTES.frontend.sulten_reservation} className={itemStyling}>
        {t(KEY.common_reservations)}
      </Link>
      <Link to={ROUTES.frontend.sulten_menu} className={itemStyling}>
        {t(KEY.common_menu)}
      </Link>
    </>
  );

  const rightItems = (
    <>
      <Link to={ROUTES.frontend.sulten_about} className={itemStyling}>
        {t(KEY.common_about_us)}
      </Link>
      <Link to={ROUTES.frontend.sulten_contact} className={itemStyling}>
        {t(KEY.common_contact_us)}
      </Link>
    </>
  );

  const hamburgerMenu = (
    <div
      onClick={() => setMobileNavigation(!showMobileNavigation)}
      className={classNames(styles.hamburger, {
        [styles.open]: showMobileNavigation,
      })}
    >
      <div className={classNames(styles.navbar_hamburger_line, styles.top)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.middle)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.bottom)} />
    </div>
  );

  const calendarIcon = <Icon icon="material-symbols:calendar-add-on-outline" className={styles.calendar_icon} />;

  const changeLanguage = () => {
    isNorwegian ? i18n.changeLanguage(LANGUAGES.EN) : i18n.changeLanguage(LANGUAGES.NB);
  };

  const languageFlag = (
    <img
      className={styles.language_flag}
      src={isNorwegian ? norwegianFlag : englishFlag}
      onClick={changeLanguage}
    ></img>
  );

  const navigationPopup = (
    <div className={styles.mobile_navigation}>
      {leftItems}
      {rightItems}
      {languageFlag}
    </div>
  );

  const navbarHeaders = (
    <div className={styles.parent_container}>
      <div className={styles.navbar_menu}>
        {isDesktop && <div></div>}
        {hamburgerMenu}
        {isDesktop && leftItems}
        <img src={lycheLogo} className={styles.logo}></img>
        {isDesktop && rightItems}
        {calendarIcon}
        {isDesktop && languageFlag}
      </div>
      {showMobileNavigation && navigationPopup}
    </div>
  );

  return <div className={styles.container}>{navbarHeaders}</div>;
}

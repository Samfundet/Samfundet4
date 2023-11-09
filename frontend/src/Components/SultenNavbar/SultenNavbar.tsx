import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { SamfundetLogo } from '~/Components';
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
  const navigate = useNavigate();

  const changeLanguage = () => {
    isNorwegian ? i18n.changeLanguage(LANGUAGES.EN) : i18n.changeLanguage(LANGUAGES.NB);
  };

  const itemStyling = classNames({
    [styles.item]: isDesktop,
    [styles.mobile_item]: !isDesktop,
  });

  const leftItems = (
    <>
      <Link to={ROUTES.frontend.home} onClick={() => setMobileNavigation(false)} className={itemStyling}>
        <SamfundetLogo className={styles.samfundet_logo} />
      </Link>

      <Link to={ROUTES.frontend.sulten_reservation} onClick={() => setMobileNavigation(false)} className={itemStyling}>
        {t(KEY.common_reservations)}
      </Link>
      <Link to={ROUTES.frontend.sulten_menu} onClick={() => setMobileNavigation(false)} className={itemStyling}>
        {t(KEY.common_menu)}
      </Link>
    </>
  );

  const rightItems = (
    <>
      <Link to={ROUTES.frontend.sulten_about} onClick={() => setMobileNavigation(false)} className={itemStyling}>
        {t(KEY.common_about_us)}
      </Link>
      <Link to={ROUTES.frontend.sulten_contact} onClick={() => setMobileNavigation(false)} className={itemStyling}>
        {t(KEY.common_contact_us)}
      </Link>
    </>
  );

  const hamburgerMenu = (
    <div onClick={() => setMobileNavigation(!showMobileNavigation)} className={styles.hamburger}>
      <div className={classNames(styles.navbar_hamburger_line, styles.top, showMobileNavigation && styles.top_open)} />
      <div
        className={classNames(styles.navbar_hamburger_line, styles.middle, showMobileNavigation && styles.middle_open)}
      />
      <div
        className={classNames(styles.navbar_hamburger_line, styles.bottom, showMobileNavigation && styles.bottom_open)}
      />
    </div>
  );

  const calendarIcon = (
    <Icon
      icon="material-symbols:calendar-add-on-outline"
      onClick={() => {
        navigate(ROUTES.frontend.sulten_reservation);
        setMobileNavigation(false);
      }}
      className={styles.calendar_icon}
    />
  );

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
        {hamburgerMenu}
        {isDesktop && leftItems}
        <img
          src={lycheLogo}
          onClick={() => {
            navigate(ROUTES.frontend.sulten);
            setMobileNavigation(false);
          }}
          className={styles.sulten_logo}
        ></img>
        {isDesktop && rightItems}
        {calendarIcon}
        {isDesktop && languageFlag}
      </div>
      {showMobileNavigation && navigationPopup}
    </div>
  );

  return <div className={styles.container}>{navbarHeaders}</div>;
}

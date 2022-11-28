import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { logout } from '~/api';
import { englishFlag, logoWhite, norwegianFlag, profileIcon } from '~/assets';
import { useAuthContext } from '~/AuthContext';
import { Button, ThemeSwitch } from '~/Components';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Navbar.module.scss';

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  // Return norwegian or english flag depending on language
  function languageImage() {
    if (i18n.language == LANGUAGES.NB) {
      return (
        <img
          src={englishFlag}
          className={styles.navbar_language_flag}
          onClick={() => i18n.changeLanguage(LANGUAGES.EN)}
        />
      );
    }
    return (
      <img
        src={norwegianFlag}
        className={styles.navbar_language_flag}
        onClick={() => i18n.changeLanguage(LANGUAGES.NB)}
      />
    );
  }

  // Return profile button for navbar if logged in
  const profileButton = (
    <div className={styles.navbar_profile_button}>
      <img src={profileIcon} className={styles.profile_icon}></img>
      <Link to={ROUTES.frontend.home} className={styles.profile_text}>
        {user?.username}
      </Link>
    </div>
  );

  //Return profile button for popup if logged in
  const profileButtonMobile = (
    <div className={styles.popup_profile}>
      <img src={profileIcon} className={styles.profile_icon}></img>
      <Link to={ROUTES.frontend.home} className={styles.profile_text}>
        {user?.username}
      </Link>
    </div>
  );

  // return hamburger menu icon
  const hamburgerMenu = (
    <div
      id={styles.navbar_hamburger}
      onClick={() => setMobileNavigation(!mobileNavigation)}
      className={mobileNavigation ? styles.open : styles.closed}
    >
      <div className={classNames(styles.navbar_hamburger_line, styles.top)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.middle)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.bottom)} />
    </div>
  );

  // Show mobile popup for navigation
  const showMobileNavigation = (
    <>
      <div className={styles.navbar_margin} />
      <nav id={styles.mobile_popup_container}>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          {t(KEY.common_event)}
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          {t(KEY.common_information)}
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          {t(KEY.common_restaurant)}
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          {t(KEY.common_volunteer)}
        </Link>
        <br />
        <a
          onClick={() => i18n.changeLanguage(i18n.language === LANGUAGES.EN ? LANGUAGES.NB : LANGUAGES.EN)}
          className={styles.popup_change_language}
        >
          {t(KEY.common_other_language)}
        </a>
        <Button
          theme="samf"
          className={styles.popup_member_button}
          onClick={() => {
            navigate(ROUTES.frontend.login);
            setMobileNavigation(false);
          }}
        >
          {t(KEY.common_member)}
        </Button>
        <Button
          theme="secondary"
          className={styles.popup_internal_button}
          onClick={() => {
            user
              ? logout().then((status) => {
                  status === 200 && setUser(undefined);
                })
              : navigate(ROUTES.frontend.login);
            setMobileNavigation(false);
          }}
        >
          {user ? t(KEY.common_logout) : t(KEY.common_internal)}
        </Button>
        {user && profileButtonMobile}
      </nav>
    </>
  );

  return (
    <>
      <nav id={styles.navbar_container}>
        <Link to="/">
          <img src={logoWhite} id={styles.navbar_logo} />
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          {t(KEY.common_event)}
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          {t(KEY.common_information)}
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          {t(KEY.common_restaurant)}
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          {t(KEY.common_volunteer)}
        </Link>
        <div className={styles.navbar_signup}>
          <ThemeSwitch />
          {user && profileButton}
          {languageImage()}
          <Button
            theme="samf"
            className={styles.navbar_member_button}
            onClick={() => {
              navigate(ROUTES.frontend.login);
              setMobileNavigation(false);
            }}
          >
            {t(KEY.common_member)}
          </Button>
          <Button
            theme="secondary"
            className={styles.navbar_internal_button}
            onClick={() => {
              user
                ? logout().then((status) => {
                    status === 200 && setUser(undefined);
                  })
                : navigate(ROUTES.frontend.login);
              setMobileNavigation(false);
            }}
          >
            {user ? t(KEY.common_logout) : t(KEY.common_internal)}
          </Button>
        </div>
        {hamburgerMenu}
      </nav>
      {mobileNavigation && showMobileNavigation}
    </>
  );
}

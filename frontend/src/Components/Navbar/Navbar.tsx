import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { logout } from '~/api';
import { englishFlag, logoWhite, norwegianFlag, profileIcon } from '~/assets';
import { useAuthContext } from '~/AuthContext';
import { Button, ThemeSwitch } from '~/Components';
import { useDesktop } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Navbar.module.scss';

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const isDesktop = useDesktop();

  const currentLanguage = i18n.language;
  const isNorwegian = currentLanguage == LANGUAGES.NB;
  const otherLanguage = isNorwegian ? LANGUAGES.EN : LANGUAGES.NB;
  const otherFlag = isNorwegian ? englishFlag : norwegianFlag;

  const languageButton = (
    <img
      src={otherFlag}
      className={classNames({
        [styles.navbar_language_flag]: isDesktop,
        [styles.popup_change_language]: !isDesktop,
      })}
      onClick={() => i18n.changeLanguage(otherLanguage)}
    />
  );

  // Return profile button for navbar if logged in
  const profileButton = (
    <div
      className={classNames({
        [styles.navbar_profile_button]: isDesktop,
        [styles.popup_profile]: !isDesktop,
      })}
    >
      <img src={profileIcon} className={styles.profile_icon}></img>
      <Link to={ROUTES.frontend.admin} className={styles.profile_text}>
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

  const navbarHeaders = (
    <>
      <Link
        to={ROUTES.frontend.events}
        className={isDesktop ? styles.navbar_link : styles.popup_link_mobile}
        onClick={() => setMobileNavigation(false)}
      >
        {t(KEY.common_event)}
      </Link>
      <Link
        to={ROUTES.frontend.about}
        className={isDesktop ? styles.navbar_link : styles.popup_link_mobile}
        onClick={() => setMobileNavigation(false)}
      >
        {t(KEY.common_information)}
      </Link>
      <Link
        to={ROUTES.frontend.lyche}
        className={isDesktop ? styles.navbar_link : styles.popup_link_mobile}
        onClick={() => setMobileNavigation(false)}
      >
        {t(KEY.common_restaurant)}
      </Link>
      <Link
        to={ROUTES.frontend.health}
        className={isDesktop ? styles.navbar_link : styles.popup_link_mobile}
        onClick={() => setMobileNavigation(false)}
      >
        {t(KEY.common_volunteer)}
      </Link>
    </>
  );

  const loginButtons = (
    <>
      <Button
        theme="samf"
        className={isDesktop ? undefined : styles.popup_member_button}
        onClick={() => {
          navigate(ROUTES.frontend.login);
          setMobileNavigation(false);
        }}
      >
        {t(KEY.common_member)}
      </Button>
      {/* Show login button */}
      {!user && (
        <Button
          theme="secondary"
          onClick={() => {
            navigate(ROUTES.frontend.login);
            setMobileNavigation(false);
          }}
        >
          {t(KEY.common_internal)}
        </Button>
      )}
      {/* Show logout button */}
      {user && (
        <Button
          theme="secondary"
          onClick={() => {
            logout()
              .then((response) => {
                response.status === STATUS.HTTP_200_OK && setUser(undefined);
              })
              .catch(console.error);

            setMobileNavigation(false);
          }}
        >
          {t(KEY.common_logout)}
        </Button>
      )}
    </>
  );

  // Show mobile popup for navigation
  const showMobileNavigation = (
    <>
      <nav id={styles.mobile_popup_container}>
        {navbarHeaders}
        <br />
        {languageButton}
        {loginButtons}
        {user && profileButton}
      </nav>
    </>
  );

  return (
    <>
      <div className={styles.navbar_padding} />
      <nav id={styles.navbar_container}>
        <Link className={styles.logoWrapper} to={ROUTES.frontend.home}>
          <img src={logoWhite} id={styles.navbar_logo} />
        </Link>

        {isDesktop && navbarHeaders}

        <div className={styles.navbar_signup}>
          <ThemeSwitch />
          {user && profileButton}
          {languageButton}
          {loginButtons}
        </div>
        {hamburgerMenu}
      </nav>
      {mobileNavigation && showMobileNavigation}
    </>
  );
}

import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '~/api';
import { englishFlag, logoBlack, logoWhite, norwegianFlag } from '~/assets';
import { useAuthContext } from '~/AuthContext';
import { Button, ThemeSwitch } from '~/Components';
import { THEME } from '~/constants';
import { useDesktop } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { useGlobalContext } from '../../GlobalContextProvider';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { theme } = useGlobalContext();
  const isDarkTheme = theme === THEME.DARK;
  const { mobileNavigation, setMobileNavigation } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const isDesktop = useDesktop();

  // Scroll detection
  const [scrollY, setScrollY] = useState(window.scrollY);
  const scrolledNavbar = scrollY > 30;
  const handleNavigation = useCallback(
    (e: Event) => {
      const window = e.currentTarget;
      if (window != null) {
        if (scrollY > window.scrollY) {
          console.log('scrolling up');
        } else if (scrollY < window.scrollY) {
          console.log('scrolling down');
        }
        setScrollY(window.scrollY);
      }
    },
    [scrollY],
  );
  useEffect(() => {
    window.addEventListener('scroll', handleNavigation);
    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [scrollY, handleNavigation]);

  // Navbar style
  const transparentNavbar = useLocation().pathname == '/' && !scrolledNavbar && !mobileNavigation;
  const navbarStyle = classNames(
    transparentNavbar ? styles.transparent_navbar : '',
    mobileNavigation ? styles.navbar_mobile : '',
  );
  const navbarImage = isDarkTheme ? logoWhite : transparentNavbar ? logoWhite : logoBlack;

  function languageImage() {
    if (i18n.language == LANGUAGES.NB) {
      return (
        <img src={englishFlag} className={styles.language_flag} onClick={() => i18n.changeLanguage(LANGUAGES.EN)} />
      );
    }
    return (
      <img src={norwegianFlag} className={styles.language_flag} onClick={() => i18n.changeLanguage(LANGUAGES.NB)} />
    );
  }

  // Return profile button for navbar if logged in
  const profileButton = (
    <div className={styles.navbar_profile_button}>
      <Icon icon="material-symbols:person"></Icon>
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
        to={ROUTES.frontend.sulten}
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
      {/* Show login button */}
      {!user && (
        <Button
          theme={isDarkTheme || (transparentNavbar && !mobileNavigation) ? 'white' : 'black'}
          rounded={true}
          className={isDesktop ? styles.login_button : styles.popup_internal_button}
          onClick={() => {
            navigate(ROUTES.frontend.login);
            setMobileNavigation(false);
          }}
        >
          {t(KEY.common_login)}
        </Button>
      )}
      {/* Show logout button */}
      {user && (
        <Button
          theme={isDarkTheme || (transparentNavbar && !mobileNavigation) ? 'white' : 'black'}
          rounded={true}
          className={isDesktop ? undefined : styles.popup_internal_button}
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
        <div className={styles.mobile_widgets}>
          {languageImage()}
          <div className={styles.mobile_user}>
            {user && profileButton}
            {loginButtons}
          </div>
          <ThemeSwitch />
        </div>
      </nav>
    </>
  );

  return (
    <>
      <div className={styles.navbar_padding} />
      <nav id={styles.navbar_container} className={navbarStyle}>
        <div className={styles.navbar_inner}>
          <Link to="/" id={styles.navbar_logo}>
            <img src={navbarImage} id={styles.navbar_logo_img} />
          </Link>
          {isDesktop && navbarHeaders}
          <div className={styles.navbar_widgets}>
            {user && profileButton}

            <ThemeSwitch />
            {languageImage()}
            {loginButtons}
          </div>
          {hamburgerMenu}
        </div>
      </nav>
      {mobileNavigation && showMobileNavigation}
    </>
  );
}

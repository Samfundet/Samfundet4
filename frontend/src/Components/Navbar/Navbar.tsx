import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/AuthContext';
import { Button, ThemeSwitch } from '~/Components';
import { NavbarItem } from '~/Components/Navbar/components';
import { HamburgerMenu } from '~/Components/Navbar/components/HamburgerMenu';
import { useGlobalContext } from '~/GlobalContextProvider';
import { logout } from '~/api';
import { englishFlag, logoBlack, logoWhite, norwegianFlag } from '~/assets';
import { useDesktop, useIsDarkTheme, useScrollY } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Navbar.module.scss';

const scrollDistanceForOpaque = 30;

export function Navbar() {
  const isDarkTheme = useIsDarkTheme();
  const { isMobileNavigation, setIsMobileNavigation } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const isDesktop = useDesktop();

  // Each NavbarItem can have a dropdown menu.
  // We want only one of them to be extended at any time, therefore this parent component
  // is given the responsibility of managing this.
  // Store the label of the currently selected dropdown.
  const [expandedDropdown, setExpandedDropdown] = useState('');

  // Language
  const currentLanguage = i18n.language;
  const isNorwegian = currentLanguage === LANGUAGES.NB;
  const otherLanguage = isNorwegian ? LANGUAGES.EN : LANGUAGES.NB;
  const otherFlag = isNorwegian ? englishFlag : norwegianFlag;

  // Scroll detection.
  const scrollY = useScrollY();
  const isScrolledNavbar = scrollY > scrollDistanceForOpaque;

  // Navbar style.
  const isRootPath = useLocation().pathname === ROUTES.frontend.home;
  const isTransparentNavbar = isRootPath && !isScrolledNavbar && !isMobileNavigation;
  const navbarLogo = isDarkTheme || isTransparentNavbar ? logoWhite : logoBlack;

  useEffect(() => {
    // Close expanded dropdown menu whenever mobile navbar is closed, or we switch from mobile to desktop, like when
    // switching from portrait to landscape on iPad.
    if (!isMobileNavigation || isDesktop) {
      setExpandedDropdown('');
    }
  }, [isMobileNavigation, isDesktop]);

  const languageButton = (
    <img src={otherFlag} className={styles.language_flag} onClick={() => i18n.changeLanguage(otherLanguage)} />
  );

  // Return profile button for navbar if logged in.
  const profileButton = (
    <div className={styles.navbar_profile_button}>
      <Icon icon="material-symbols:person"></Icon>
      <Link to={ROUTES.frontend.admin} className={styles.profile_text}>
        {user?.username}
      </Link>
    </div>
  );

  const infoLinks = (
    <>
      <Link to={ROUTES.frontend.about} className={styles.navbar_dropdown_link}>
        {t(KEY.common_about_samfundet)}
      </Link>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.common_membership)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.common_opening_hours)}
      </a>
      <a href={ROUTES.other.foto_samfundet_no} className={styles.navbar_dropdown_link}>
        {t(KEY.navbar_photos)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.navbar_nybygg)}
      </a>
    </>
  );

  const navbarHeaders = (
    <>
      <NavbarItem
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={ROUTES.frontend.events}
        label={t(KEY.common_event)}
      />
      <NavbarItem
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={'#'}
        label={t(KEY.common_information)}
        dropdownLinks={infoLinks}
      />
      <NavbarItem
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={ROUTES.frontend.sulten}
        label={t(KEY.common_restaurant)}
      />
      <NavbarItem
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={ROUTES.frontend.health}
        label={t(KEY.common_volunteer)}
      />
    </>
  );

  const isLightLoginButton = isDarkTheme || (isTransparentNavbar && !isMobileNavigation);

  const loginButton = !user && (
    <Button
      theme={isLightLoginButton ? 'white' : 'black'}
      rounded={true}
      className={isDesktop ? styles.login_button : styles.popup_internal_button}
      onClick={() => {
        navigate(ROUTES.frontend.login);
        setIsMobileNavigation(false);
      }}
    >
      {t(KEY.common_login)}
    </Button>
  );

  const logoutButton = user && (
    <Button
      theme={isLightLoginButton ? 'white' : 'black'}
      rounded={true}
      className={isDesktop ? undefined : styles.popup_internal_button}
      onClick={() => {
        logout()
          .then((response) => {
            response.status === STATUS.HTTP_200_OK && setUser(undefined);
          })
          .catch(console.error);

        setIsMobileNavigation(false);
      }}
    >
      {t(KEY.common_logout)}
    </Button>
  );

  // Show mobile popup for navigation
  const mobileNavigation = (
    <>
      <nav id={styles.mobile_popup_container}>
        {navbarHeaders}
        <div className={styles.mobile_widgets}>
          {languageButton}
          <div className={styles.mobile_user}>
            {user && profileButton}
            {loginButton}
            {logoutButton}
          </div>
          <ThemeSwitch />
        </div>
      </nav>
    </>
  );

  return (
    <>
      <nav id={styles.navbar_container} className={classNames(isTransparentNavbar && styles.transparent_navbar)}>
        <div className={styles.navbar_inner}>
          <Link to={ROUTES.frontend.home} id={styles.navbar_logo}>
            <img src={navbarLogo} id={styles.navbar_logo_img} />
          </Link>
          {isDesktop && navbarHeaders}
          <div className={styles.navbar_widgets}>
            {user && profileButton}

            <ThemeSwitch />
            {languageButton}
            {loginButton}
            {logoutButton}
          </div>
          <HamburgerMenu />
        </div>
      </nav>
      {isMobileNavigation && mobileNavigation}
    </>
  );
}

import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useTranslation } from 'react-i18next';
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '~/api';
import { englishFlag, logoBlack, logoWhite, norwegianFlag } from '~/assets';
import { useAuthContext } from '~/AuthContext';
import { Button, ThemeSwitch } from '~/Components';
import { THEME } from '~/constants';
import { useDesktop, useScrollY } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './Navbar.module.scss';
import { ReactNode, useEffect, useState } from 'react';

const scrollDistanceForOpaque = 30;

export function Navbar() {
  const { theme } = useGlobalContext();
  const isDarkTheme = theme === THEME.DARK;
  const { mobileNavigation, setMobileNavigation } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const isDesktop = useDesktop();
  const [expandedDropdown, setExpandedDropdown] = useState('');

  // Scroll detection
  const scrollY = useScrollY();
  const scrolledNavbar = scrollY > scrollDistanceForOpaque;

  // Navbar style
  const isRootPath = useLocation().pathname == '/';
  const transparentNavbar = isRootPath && !scrolledNavbar && !mobileNavigation;
  const navbarStyle = classNames(
    transparentNavbar && styles.transparent_navbar,
    mobileNavigation && styles.navbar_mobile,
  );
  const navbarImage = isDarkTheme || transparentNavbar ? logoWhite : logoBlack;

  useEffect(() => {
    // Close expanded dropdown menu whenever mobile navbar is closed, or we switch from mobile to desktop, like when
    // switching from portrait to landscape on iPad
    if (!mobileNavigation || isDesktop) {
      setExpandedDropdown('');
    }
  }, [mobileNavigation, isDesktop]);

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

  const infoLinks = (
    <>
      <Link to={ROUTES.frontend.about} className={styles.navbar_dropdown_link}>
        {t(KEY.common_about_samfundet)}
      </Link>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.common_membership)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.opening_hours)}
      </a>
      <a href={ROUTES.other.foto_samfundet_no} className={styles.navbar_dropdown_link}>
        {t(KEY.photos)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link}>
        {t(KEY.nybygg)}
      </a>
    </>
  );

  const navbarItem = (route: string, label: string, dropdownLinks?: ReactNode) => {
    const itemClasses = classNames(
      isDesktop ? styles.navbar_item : styles.navbar_mobile_item,
      dropdownLinks && styles.navbar_dropdown_item,
      expandedDropdown !== '' && expandedDropdown !== label && styles.hidden,
    );

    const dropdownClasses = classNames(
      isDesktop ? styles.dropdown_container : styles.mobile_dropdown_container,
      expandedDropdown === label && styles.dropdown_open,
    );

    // Desktop: show dropdown on hover
    // Mobile: show dropdown after clicking
    const showDropdown = dropdownLinks && (isDesktop || expandedDropdown === label);

    return (
      <div className={itemClasses}>
        <Link
          to={route}
          className={isDesktop ? styles.navbar_link : styles.popup_link_mobile}
          onClick={() => {
            if (!dropdownLinks) {
              setMobileNavigation(false);
            } else if (!isDesktop) {
              // toggle dropdown
              setExpandedDropdown(expandedDropdown === label ? '' : label);
            }
          }}
        >
          {label}
          {dropdownLinks && <Icon icon={`carbon:chevron-${expandedDropdown === label ? 'up' : 'down'}`} width={18} />}
        </Link>
        {showDropdown && <div className={dropdownClasses}>{dropdownLinks}</div>}
      </div>
    );
  };

  const navbarHeaders = (
    <>
      {navbarItem(ROUTES.frontend.events, t(KEY.common_event))}
      {navbarItem('#', t(KEY.common_information), infoLinks)}
      {navbarItem(ROUTES.frontend.sulten, t(KEY.common_restaurant))}
      {navbarItem(ROUTES.frontend.health, t(KEY.common_volunteer))}
    </>
  );

  const lightLoginButton = isDarkTheme || (transparentNavbar && !mobileNavigation);

  const loginButtons = (
    <>
      {/* Show login button */}
      {!user && (
        <Button
          theme={lightLoginButton ? 'white' : 'black'}
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
          theme={lightLoginButton ? 'white' : 'black'}
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

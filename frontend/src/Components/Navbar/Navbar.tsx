import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/AuthContext';
import { Button, Link, NotificationBadge, ThemeSwitch } from '~/Components';
import { NavbarItem } from '~/Components/Navbar/components';
import { HamburgerMenu } from '~/Components/Navbar/components/HamburgerMenu';
import { useGlobalContext } from '~/GlobalContextProvider';
import { getActiveRecruitments, impersonateUser, logout } from '~/api';
import { englishFlag, logoWhite, norwegianFlag } from '~/assets';
import { useDesktop, useScrollY } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Navbar.module.scss';
import { RecruitmentDto } from '~/dto';

const scrollDistanceForOpaque = 30;

export function Navbar() {
  const { isMobileNavigation, setIsMobileNavigation, notifications } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const [activeRecruitments, setActiveRecruitments] = useState<RecruitmentDto[]>();
  const navigate = useNavigate();
  const isDesktop = useDesktop();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [cookies, setCookie, removeCookie] = useCookies();

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

  useEffect(() => {
    // Close expanded dropdown menu whenever mobile navbar is closed, or we switch from mobile to desktop, like when
    // switching from portrait to landscape on iPad.
    if (!isMobileNavigation || isDesktop) {
      setExpandedDropdown('');
    }
  }, [isMobileNavigation, isDesktop]);

  useEffect(() => {
    getActiveRecruitments().then((response) => {
      setActiveRecruitments(response.data);
    });
  }, []);

  const languageButton = (
    <button className={styles.language_flag_button} onClick={() => i18n.changeLanguage(otherLanguage)}>
      <img src={otherFlag} className={styles.language_flag} />
    </button>
  );

  // Return profile button for navbar if logged in.
  const mobileProfileButton = (
    <div className={styles.navbar_profile_button}>
      <Icon icon="material-symbols:person"></Icon>
      <Link url={ROUTES.frontend.admin} className={styles.profile_text}>
        {user?.username}
      </Link>
    </div>
  );

  const infoLinks = (
    <>
      <Link
        url={ROUTES.frontend.about}
        className={styles.navbar_dropdown_link}
        onAfterClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_general)}
      </Link>
      <a href="#" className={styles.navbar_dropdown_link} onClick={() => setExpandedDropdown('')}>
        {t(KEY.common_membership)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link} onClick={() => setExpandedDropdown('')}>
        {t(KEY.common_opening_hours)}
      </a>
      <Link
        url={ROUTES.frontend.venues}
        className={styles.navbar_dropdown_link}
        onAfterClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_map)}
      </Link>
      <a
        href={ROUTES.other.foto_samfundet_no}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_photos)}
      </a>
      <a href="#" className={styles.navbar_dropdown_link} onClick={() => setExpandedDropdown('')}>
        {t(KEY.navbar_nybygg)}
      </a>
    </>
  );

  const navbarHeaders = (
    <div className={isDesktop ? styles.navbar_main_links : styles.navbar_main_links_mobile}>
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
        route={ROUTES.frontend.recruitment}
        label={t(KEY.common_volunteer)}
        labelClassName={activeRecruitments && styles.active_recruitment}
      />
    </div>
  );

  /* eslint-disable-next-line no-prototype-builtins */
  const isImpersonate = cookies.hasOwnProperty('impersonated_user_id');

  const userDropdownLinks = (
    <>
      <Link url={ROUTES.frontend.admin} className={styles.navbar_dropdown_link}>
        <Icon icon="material-symbols:settings" />
        {t(KEY.control_panel_title)}
      </Link>
      {isImpersonate && (
        <button
          type="button"
          className={classNames(styles.navbar_dropdown_link, styles.navbar_logout_button)}
          onClick={() => {
            impersonateUser(undefined)
              .then(() => {
                window.location.reload();
              })
              .catch(console.error);
            setIsMobileNavigation(false);
          }}
        >
          <Icon icon="ri:spy-fill" />
          Stop Agent Mode
        </button>
      )}
      <button
        type="button"
        className={classNames(styles.navbar_dropdown_link, styles.navbar_logout_button)}
        onClick={(e) => {
          e.preventDefault();
          setExpandedDropdown('');
          logout()
            .then((response) => {
              response.status === STATUS.HTTP_200_OK && setUser(undefined);
            })
            .catch(console.error);

          setIsMobileNavigation(false);
        }}
      >
        <Icon icon="material-symbols:logout" />
        {t(KEY.common_logout)}
      </button>
    </>
  );

  const profileButton = user && (
    <div className={classNames(styles.navbar_profile_button, styles.profile_text, styles.dropdown_container_left)}>
      <NavbarItem
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={'#'}
        label={user.username}
        icon={isImpersonate ? 'mdi:eye' : 'material-symbols:person'}
        dropdownLinks={userDropdownLinks}
      />
    </div>
  );

  const loginButton = !user && (
    <Button
      theme={'white'}
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
      theme={'white'}
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

  // Show mobile popup for navigation.
  const mobileNavigation = (
    <>
      <nav id={styles.mobile_popup_container}>
        {navbarHeaders}

        <div className={styles.mobile_widgets}>
          {languageButton}
          <div className={styles.mobile_user}>
            {loginButton}
            {logoutButton}
          </div>
          <ThemeSwitch />
        </div>
        <br></br>
        {user && mobileProfileButton}
      </nav>
    </>
  );

  return (
    <>
      <nav id={styles.navbar_container} className={classNames(isTransparentNavbar && styles.transparent_navbar)}>
        <div className={styles.navbar_inner}>
          <Link url={ROUTES.frontend.home} className={styles.navbar_logo}>
            <img src={logoWhite} id={styles.navbar_logo_img} />
          </Link>
          {isDesktop && navbarHeaders}
          <div className={styles.navbar_widgets}>
            <ThemeSwitch />
            <NotificationBadge number={notifications.length || undefined} onClick={() => console.log(1)} />
            {languageButton}
            {loginButton}
            {profileButton}
          </div>
          <HamburgerMenu transparentBackground={isTransparentNavbar} />
        </div>
      </nav>
      {isMobileNavigation && mobileNavigation}
    </>
  );
}

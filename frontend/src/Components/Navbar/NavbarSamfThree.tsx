// ******************************************************************************************************************************
// Replication of Samf3 navbar. Use until Samf4 is fully ready.
// ******************************************************************************************************************************

import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Button, Link, ThemeSwitch } from '~/Components';
import { getActiveRecruitments, logout, stopImpersonatingUser } from '~/api';
import { logoWhite } from '~/assets';
import { useAuthContext } from '~/context/AuthContext';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import type { RecruitmentDto } from '~/dto';
import { useDesktop } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { SAMF3_MEMBER_URL } from '~/routes/samf-three';
import styles from './NavbarSamfThree.module.scss';
import { HamburgerMenu, LanguageButton } from './components';
import { NavbarItemSamfThree } from './components/NavbarItem';

const scrollDistanceForOpaque = 30;

export function NavbarSamfThree() {
  const { isMobileNavigation, setIsMobileNavigation } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthContext();
  const [activeRecruitments, setActiveRecruitments] = useState<RecruitmentDto[]>();
  const navigate = useNavigate();
  const isDesktop = useDesktop();
  const [cookies, setCookie, removeCookie] = useCookies();

  // Each NavbarItem can have a dropdown menu.
  // We want only one of them to be extended at any time, therefore this parent component
  // is given the responsibility of managing this.
  // Store the label of the currently selected dropdown.
  const [expandedDropdown, setExpandedDropdown] = useState('');

  // Navbar style.
  const isRootPath = useLocation().pathname === ROUTES.frontend.home;

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

  const showActiveRecruitments = activeRecruitments !== undefined && activeRecruitments?.length > 0;

  // Return profile button for navbar if logged in.
  const mobileProfileButton = (
    <div className={styles.navbar_profile_button}>
      <Icon icon="material-symbols:person" />
      <Link url={ROUTES.frontend.admin} className={styles.profile_text}>
        {user?.username}
      </Link>
    </div>
  );

  const infoLinks = (
    <>
      <a
        href={ROUTES.samfThree.information.general}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_general)}
      </a>
      <a
        href={ROUTES.samfThree.information.membership}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_membership)}
      </a>
      <a
        href={ROUTES.samfThree.information.openingHours}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_opening_hours)}
      </a>
      <a
        href={ROUTES.samfThree.information.photos}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_photos)}
      </a>
      <a
        href={ROUTES.samfThree.information.renting}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_rent_services)}
      </a>
    </>
  );

  const venueLinks = (
    <>
      <a
        href={ROUTES.samfThree.venues.restaurant}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.common_restaurant)}
      </a>
      <a
        href={ROUTES.samfThree.venues.bar}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_bar)}
      </a>
      <a
        href={ROUTES.samfThree.venues.scene}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_stages)}
      </a>
      <a
        href={ROUTES.samfThree.venues.club}
        className={styles.navbar_dropdown_link}
        onClick={() => setExpandedDropdown('')}
      >
        {t(KEY.navbar_club)}
      </a>
    </>
  );

  const navbarHeaders = (
    <div className={isDesktop ? styles.navbar_main_links : styles.navbar_main_links_mobile}>
      <NavbarItemSamfThree
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={ROUTES.frontend.events}
        label={t(KEY.common_event)}
      />
      <NavbarItemSamfThree
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={'#'}
        label={t(KEY.common_information)}
        dropdownLinks={infoLinks}
      />
      <NavbarItemSamfThree
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={'#'}
        label={t(KEY.common_venues)}
        dropdownLinks={venueLinks}
      />
    </div>
  );

  const recruitmentButton = (
    <div className={isDesktop ? styles.navbar_main_links : styles.navbar_main_links_mobile}>
      <NavbarItemSamfThree
        setExpandedDropdown={setExpandedDropdown}
        expandedDropdown={expandedDropdown}
        route={ROUTES.samfThree.volunteer}
        label={t(KEY.common_volunteer)}
        labelClassName={showActiveRecruitments ? styles.active_recruitment : ''}
      />
    </div>
  );

  // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
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
            stopImpersonatingUser()
              .then(() => {
                window.location.reload();
              })
              .catch(console.error);
            setIsMobileNavigation(false);
          }}
        >
          <Icon icon="ri:spy-fill" />
          {t(KEY.admin_stop_impersonate)}
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
      <NavbarItemSamfThree
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
      {t(KEY.loginpage_internal_login)}
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

  const memberButton = (
    <Button
      theme="samf"
      rounded={true}
      className={isDesktop ? styles.login_button : styles.popup_internal_button}
      onClick={() => {
        window.location.href = SAMF3_MEMBER_URL.medlem;
        setIsMobileNavigation(false);
      }}
    >
      {t(KEY.common_member)}
    </Button>
  );

  // Show mobile popup for navigation.
  const mobileNavigation = (
    <>
      <nav id={styles.mobile_popup_container}>
        {navbarHeaders}
        {recruitmentButton}
        <div className={styles.mobile_widgets}>
          <ThemeSwitch />
          <div className={styles.mobile_user}>
            {memberButton}
            {loginButton}
          </div>
          <LanguageButton />
        </div>
        <br />
        {user && mobileProfileButton}
      </nav>
    </>
  );

  return (
    <>
      <nav id={styles.navbar_container}>
        <div className={styles.navbar_inner}>
          <Link url={ROUTES.frontend.home} className={styles.navbar_logo}>
            <img src={logoWhite} id={styles.navbar_logo_img} alt="Logo" />
          </Link>
          {isDesktop && navbarHeaders}
          {isDesktop && recruitmentButton}
          <div className={styles.navbar_widgets}>
            <ThemeSwitch />
            <LanguageButton />
            {memberButton}
            {loginButton}
            {profileButton}
          </div>
          <HamburgerMenu />
        </div>
      </nav>
      {isMobileNavigation && mobileNavigation}
    </>
  );
}

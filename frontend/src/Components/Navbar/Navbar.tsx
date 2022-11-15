import classNames from 'classnames';
import { useState } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { englishFlag, logoWhite, norwegianFlag, profileIcon } from '~/assets';
import { Button, ThemeSwitch } from '~/Components';
import { ROUTES } from '~/routes';
import styles from './Navbar.module.scss';

function changeLanguage() {
  console.log('language changed :)');
}

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const [loggedIn] = useState(true);
  const [language, setLanguage] = useState(0);

  // Return norwegian or english flag depending on language
  function languageImage() {
    if (language) {
      return <img src={norwegianFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(0)} />;
    }
    return <img src={englishFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(1)} />;
  }

  // Return profile button for navbar if logged in
  const profileButton = (
    <div className={styles.navbar_profile_button}>
      <img src={profileIcon} className={styles.profile_icon}></img>
      <Link to={ROUTES.frontend.home} className={styles.profile_text}>
        Username
      </Link>
    </div>
  );

  //Return profile button for popup if logged in
  const profileButtonMobile = (
    <div className={styles.popup_profile}>
      <img src={profileIcon} className={styles.profile_icon}></img>
      <Link to={ROUTES.frontend.home} className={styles.profile_text}>
        Username
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
          Arrangement
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          Information
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          Restaurant
        </Link>
        <Link
          to={ROUTES.frontend.health}
          className={styles.popup_link_mobile}
          onClick={() => setMobileNavigation(false)}
        >
          Opptak
        </Link>
        <br />
        <a onClick={() => changeLanguage()} className={styles.popup_change_language}>
          English
        </a>
        <Button className={styles.popup_member_button}>
          <Link to={ROUTES.frontend.health} className={styles.member_button_link}>
            Medlem
          </Link>
        </Button>
        <Button theme="secondary" className={styles.popup_internal_button}>
          <Link to={ROUTES.frontend.health} className={styles.internal_button_link}>
            Intern
          </Link>
        </Button>
        {loggedIn && profileButtonMobile}
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
          Arrangement
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          Information
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          Restaurant
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link}>
          Opptak
        </Link>
        <div className={styles.navbar_signup}>
          <ThemeSwitch />
          {loggedIn && profileButton}
          {languageImage()}
          <Button className={styles.navbar_member_button}>
            <Link to={ROUTES.frontend.health} className={styles.member_button_link}>
              Medlem
            </Link>
          </Button>
          <Button theme="secondary" className={styles.navbar_internal_button}>
            <Link to={ROUTES.frontend.health} className={styles.internal_button_link}>
              Intern
            </Link>
          </Button>
        </div>
        {hamburgerMenu}
      </nav>
      {mobileNavigation && showMobileNavigation}
    </>
  );
}

import React, { useState } from 'react';
import logo from '../../assets/logo_white.png';
import profileIcon from '../../assets/user.png';
import englishFlag from '../../assets/english.png';
import norwegianFlag from '../../assets/norwegian.png';
import { NavLink as Link, Routes } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { ROUTES } from '../../routes';
import { Button } from '../Button';

function changeLanguage() {
  console.log('language changed :)');
}

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(0);
  const [loggedIn, setLoggedIn] = useState(1);
  const [language, setLanguage] = useState(0);

  function languageImage() {
    if (language) {
      return <img src={norwegianFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(0)} />;
    }
    return <img src={englishFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(1)} />;
  }

  function profileButton() {
    if (loggedIn) {
      return (
        <div className={styles.navbar_profile_button}>
          <img src={profileIcon} className={styles.navbar_profile_icon}></img>
          <Link to={ROUTES.frontend.home} className={styles.navbar_profile_text}>
            Username
          </Link>
        </div>
      );
    }
    return <></>;
  }

  function profileButtonMobile() {
    if (loggedIn) {
      return (
        <div className={styles.navbar_profile_mobile}>
          <img src={profileIcon} className={styles.navbar_profile_icon}></img>
          <Link to={ROUTES.frontend.home} className={styles.navbar_profile_text}>
            Username
          </Link>
        </div>
      );
    }
    return <></>;
  }

  function hamburgerFunction(): JSX.Element {
    return (
      <div
        id={styles.navbar_hamburger}
        onClick={() => (mobileNavigation ? setMobileNavigation(0) : setMobileNavigation(1))}
        className={mobileNavigation ? styles.open : styles.closed}
      >
        <div className={styles.navbar_hamburger_line + ' ' + styles.top} />
        <div className={styles.navbar_hamburger_line + ' ' + styles.middle} />
        <div className={styles.navbar_hamburger_line + ' ' + styles.bottom} />{' '}
      </div>
    );
  }

  function showMobileNavigation() {
    return (
      <nav className={styles.navbar_popup_mobile}>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link_mobile}>
          Arrangement
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link_mobile}>
          Information
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link_mobile}>
          Restaurant
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.navbar_link_mobile}>
          Opptak
        </Link>
        <br />
        <a onClick={() => changeLanguage()} className={styles.navbar_language_mobile}>
          English
        </a>
        <Button className={styles.mobile_nav_member_button}>
          <Link to={ROUTES.frontend.health} className={styles.navbar_member_link}>
            Medlem
          </Link>
        </Button>
        <Button theme="secondary" className={styles.navbar_internal_button}>
          <Link to={ROUTES.frontend.health} className={styles.navbar_internal_link}>
            Intern
          </Link>
        </Button>
        {profileButtonMobile()}
      </nav>
    );
  }

  return (
    <>
      <nav className={styles.navbar_nav}>
        <Link to="/">
          <img src={logo} className={styles.navbar_logo} />
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
          {profileButton()}
          {languageImage()}
          <Button className={styles.navbar_member_button}>
            <Link to={ROUTES.frontend.health} className={styles.navbar_member_link}>
              Medlem
            </Link>
          </Button>
          <Button theme="secondary" className={styles.navbar_internal_button}>
            <Link to={ROUTES.frontend.health} className={styles.navbar_internal_link}>
              Intern
            </Link>
          </Button>
        </div>
        {hamburgerFunction()}
      </nav>
      {mobileNavigation ? showMobileNavigation() : <></>}
    </>
  );
}

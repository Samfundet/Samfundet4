import React, { useState } from 'react';
import logo from '../../assets/logo_white.png';
import profileIcon from '../../assets/user.png';
import englishFlag from '../../assets/english.png';
import norwegianFlag from '../../assets/norwegian.png';
import { NavLink as Link, Routes } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { ROUTES } from '../../routes';
import { Button } from '../Button';
import classNames from 'classnames';

function changeLanguage() {
  console.log('language changed :)');
}

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(0);
  const [loggedIn, setLoggedIn] = useState(1);
  const [language, setLanguage] = useState(0);

  // Return norwegian or english flag depending on language
  function languageImage() {
    if (language) {
      return <img src={norwegianFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(0)} />;
    }
    return <img src={englishFlag} className={styles.navbar_language_flag} onClick={() => setLanguage(1)} />;
  }

  // Return profile button for navbar if logged in
  function profileButton() {
    if (loggedIn) {
      return (
        <div className={styles.navbar_profile_button}>
          <img src={profileIcon} className={styles.profile_icon}></img>
          <Link to={ROUTES.frontend.home} className={styles.profile_text}>
            Username
          </Link>
        </div>
      );
    }
    return <></>;
  }

  //Return profile button for popup if logged in
  function profileButtonMobile() {
    if (loggedIn) {
      return (
        <div className={styles.popup_profile}>
          <img src={profileIcon} className={styles.profile_icon}></img>
          <Link to={ROUTES.frontend.home} className={styles.profile_text}>
            Username
          </Link>
        </div>
      );
    }
    return <></>;
  }

  // return hamburger menu icon
  function hamburgerFunction(): JSX.Element {
    return (
      <div
        id={styles.navbar_hamburger}
        onClick={() => (mobileNavigation ? setMobileNavigation(0) : setMobileNavigation(1))}
        className={mobileNavigation ? styles.open : styles.closed}
      >
        <div className={classNames(styles.navbar_hamburger_line, styles.top)} />
        <div className={classNames(styles.navbar_hamburger_line, styles.middle)} />
        <div className={classNames(styles.navbar_hamburger_line, styles.bottom)} />
      </div>
    );
  }

  // Show mobile popup for navigation
  function showMobileNavigation() {
    return (
      <nav id={styles.mobile_popup_container}>
        <Link to={ROUTES.frontend.health} className={styles.popup_link_mobile}>
          Arrangement
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.popup_link_mobile}>
          Information
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.popup_link_mobile}>
          Restaurant
        </Link>
        <Link to={ROUTES.frontend.health} className={styles.popup_link_mobile}>
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
        {profileButtonMobile()}
      </nav>
    );
  }

  return (
    <>
      <nav id={styles.navbar_container}>
        <Link to="/">
          <img src={logo} id={styles.navbar_logo} />
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
        {hamburgerFunction()}
      </nav>
      {mobileNavigation ? showMobileNavigation() : <></>}
    </>
  );
}

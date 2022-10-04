import React, { useState } from 'react';
import logo from '../../assets/logo_white.png';
import { NavLink as Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { ROUTES } from '../../routes';
import { Button } from '../Button';

function changeLanguage() {
  console.log('language changed :)');
}

export function Navbar() {
  const [mobileNavigation, setMobileNavigation] = useState(0);

  function hamburgerFunction() {
    return (
      <div
        className={styles.navbar_hamburger}
        onClick={() => (mobileNavigation ? setMobileNavigation(0) : setMobileNavigation(1))}
      >
        <div
          className={styles.navbar_hamburger_line}
          style={
            mobileNavigation
              ? {
                  transform: 'translateY(12px) rotate(-45deg)',
                  transition: 'transform 400ms ease',
                }
              : {}
          }
        />
        <div
          className={styles.navbar_hamburger_line}
          style={mobileNavigation ? { opacity: '0%' } : { opacity: '100%' }}
        />
        <div
          className={styles.navbar_hamburger_line}
          style={
            mobileNavigation
              ? {
                  transform: 'translateY(-11px) rotate(45deg)',
                  transition: 'transform 400ms ease',
                }
              : {}
          }
        />
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

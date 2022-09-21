import React from 'react';
import logo from '../../assets/logo_white.png';
import { NavLink as Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { Button } from 'Components/Button';
import { ROUTES } from '../../routes';

export function Navbar() {
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
          Restaurant
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
        <div className={styles.navbar_hamburger}>
          <div className={styles.navbar_hamburger_lines} />
          <div className={styles.navbar_hamburger_lines} />
          <div className={styles.navbar_hamburger_lines} />
        </div>
      </nav>
    </>
  );
}

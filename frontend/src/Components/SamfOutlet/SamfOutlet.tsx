import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import { NavbarSamfThree } from '~/Components//Navbar/NavbarSamfThree';
import { Footer } from '../Footer';
import styles from './SamfOutlet.module.scss';

export function SamfOutlet() {
  return (
    <SamfLayout>
      <Outlet />
    </SamfLayout>
  );
}

export function SamfLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarSamfThree />
      <div className={styles.navbar_outlet}>{children}</div>
      <Footer />
    </>
  );
}

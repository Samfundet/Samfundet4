import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '~/Components/NavbarSamfThree/Navbar';
import { SiteBanner } from '~/Components/SiteBanner/SiteBanner';
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
  const location = useLocation();

  const showBanner = location.pathname === '/' || location.pathname === '/home/';

  return (
    <>
      {/* TODO: Uncomment the following line when samf4 navbar is enabled */}
      {/* <Navbar /> */}
      {/* TODO: Remove the following line when samf4 navbar is enabled */}
      {showBanner && <SiteBanner />}
      <Navbar />
      <div className={styles.navbar_outlet}>{children}</div>
      <Footer />
    </>
  );
}

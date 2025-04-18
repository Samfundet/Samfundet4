import { Outlet } from 'react-router';
import { IsfitNavbar } from './IsfitNavbar/IsfitNavbar';
import styles from './IsfitOutlet.module.scss';

export function IsfitOutlet() {
  return (
    <>
      <IsfitNavbar />
      <div className={styles.navbar_outlet}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}

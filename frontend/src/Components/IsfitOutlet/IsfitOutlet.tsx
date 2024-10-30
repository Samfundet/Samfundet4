import { Outlet } from 'react-router-dom';
import { IsfitNavbar } from './IsfitNavbar';
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

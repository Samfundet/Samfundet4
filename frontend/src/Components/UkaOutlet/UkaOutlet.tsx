import { Outlet } from 'react-router-dom';
import { UkaNavbar } from './UkaNavbar';
import styles from './UkaOutlet.module.scss';

export function UkaOutlet() {
  return (
    <>
      <UkaNavbar />
      <div className={styles.navbar_outlet}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}

import { Outlet } from 'react-router-dom';
import { SultenNavbar } from './SultenNavbar';
import { SultenFooter } from '../SultenFooter';

export function SultenNavbarLayout() {
  return (
    <div>
      <SultenNavbar />
      <div>
        <Outlet />
      </div>
      <SultenFooter />
    </div>
  );
}

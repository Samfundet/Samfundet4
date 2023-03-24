import { Outlet } from 'react-router-dom';
import { SultenNavbar } from './SultenNavbar';

export function SultenNavbarLayout() {
  return (
    <div>
      <SultenNavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

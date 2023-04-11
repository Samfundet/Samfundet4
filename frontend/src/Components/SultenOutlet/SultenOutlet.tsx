import { Outlet } from 'react-router-dom';
import { SultenNavbar } from '~/Components/SultenNavbar';
import { SultenFooter } from '~/Components/SultenFooter';

export function SultenOutlet() {
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

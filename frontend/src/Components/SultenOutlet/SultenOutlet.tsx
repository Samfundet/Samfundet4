import { Outlet } from 'react-router';
import { SultenFooter } from '~/Components/SultenFooter';
import { SultenNavbar } from '~/Components/SultenNavbar';

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

import { Outlet } from 'react-router-dom';
import { Navbar } from '~/Components/Navbar';

export function SamfOutlet() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

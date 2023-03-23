import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function NavbarLayout() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

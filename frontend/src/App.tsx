import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '~/Components/Navbar';
import { AppRoutes } from '~/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

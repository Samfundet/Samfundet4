import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '~/AppRoutes';
import { Navbar } from '~/Components/Navbar';

// Neccessary import for translations
import './i18n/i18n';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

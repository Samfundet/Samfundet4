import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '~/AppRoutes';
import { Navbar } from '~/Components/Navbar';
import {Footer} from '~/Components/Footer';

// Neccessary import for translations
import './i18n/i18n';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer iconSize={45}/>
    </BrowserRouter>
  );
}

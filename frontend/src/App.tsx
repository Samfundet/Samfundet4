import { Navbar } from 'Components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

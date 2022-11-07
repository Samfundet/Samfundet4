import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '~/AppRoutes';
import { Navbar } from '~/Components/Navbar';
import { useGlobalContext } from '~/GlobalContextProvider';

export function App() {
  const { theme } = useGlobalContext();
  document.body.classList.add(theme);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

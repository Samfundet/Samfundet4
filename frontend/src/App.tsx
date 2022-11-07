import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '~/AppRoutes';
import { Navbar } from '~/Components/Navbar';
import { useGlobalContext } from '~/GlobalContextProvider';

export function App() {
  const { test } = useGlobalContext();
  console.log(test);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

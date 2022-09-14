import { Route, Routes } from 'react-router-dom';
import { HomePage } from './Pages';
import { ROUTES } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
    </Routes>
  );
}

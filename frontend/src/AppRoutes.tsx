import { Route, Routes } from 'react-router-dom';
import { HealthPage, HomePage } from '~/Pages';
import { ROUTES } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
      <Route path={ROUTES.frontend.health} element={<HealthPage />} />
    </Routes>
  );
}

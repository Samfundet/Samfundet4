import { Route, Routes } from 'react-router-dom';
import { ComponentPage, HealthPage, HomePage, LoginPage } from '~/Pages';
import { ROUTES } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
      <Route path={ROUTES.frontend.health} element={<HealthPage />} />
      <Route path={ROUTES.frontend.components} element={<ComponentPage />} />
      <Route path={ROUTES.frontend.login} element={<LoginPage />} />
    </Routes>
  );
}

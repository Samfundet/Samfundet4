import { HealthPage, HomePage, EventPage, EventsPage } from 'Pages';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
      <Route path={ROUTES.frontend.health} element={<HealthPage />} />
      <Route path={ROUTES.frontend.events} element={<EventsPage />} />
      <Route path={ROUTES.frontend.event} element={<EventPage />} />
    </Routes>
  );
}

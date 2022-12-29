import { Route, Routes } from 'react-router-dom';
import { useGoatCounter } from '~/hooks';
import {
  AboutPage,
  ApiTestingPage,
  ComponentPage,
  GroupsPage,
  HealthPage,
  HomePage,
  InformationFormPage,
  InformationListPage,
  InformationPage,
  LoginPage,
  LychePage,
  AdminPage,
  EventPage,
  EventsPage,
} from '~/Pages';
import {
  EventsAdminPage,
  EventFormAdminPage,
  GangsAdminPage,
  GangsFormAdminPage,
  InformationAdminPage,
  InformationFormAdminPage,
} from '~/PagesAdmin';
import { ROUTES } from './routes';

export function AppRoutes() {
  // Must be called within <BrowserRouter> because it uses hook useLocation().
  useGoatCounter();

  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
      <Route path={ROUTES.frontend.about} element={<AboutPage />} />
      <Route path={ROUTES.frontend.health} element={<HealthPage />} />
      <Route path={ROUTES.frontend.components} element={<ComponentPage />} />
      <Route path={ROUTES.frontend.login} element={<LoginPage />} />
      <Route path={ROUTES.frontend.api_testing} element={<ApiTestingPage />} />
      <Route path={ROUTES.frontend.lyche} element={<LychePage />} />
      <Route path={ROUTES.frontend.information_page_detail} element={<InformationPage />} />
      <Route path={ROUTES.frontend.information_page_list} element={<InformationListPage />} />
      <Route path={ROUTES.frontend.information_page_edit} element={<InformationFormPage />} />
      <Route path={ROUTES.frontend.groups} element={<GroupsPage />} />
      <Route path={ROUTES.frontend.admin} element={<AdminPage />} />
      <Route path={ROUTES.frontend.admin_gangs} element={<GangsAdminPage />} />
      <Route path={ROUTES.frontend.admin_gangs_create} element={<GangsFormAdminPage />} />
      <Route path={ROUTES.frontend.admin_gangs_edit} element={<GangsFormAdminPage />} />
      <Route path={ROUTES.frontend.events} element={<EventsPage />} />
      <Route path={ROUTES.frontend.event} element={<EventPage />} />
      <Route path={ROUTES.frontend.admin_events_upcomming} element={<EventsAdminPage />} />
      <Route path={ROUTES.frontend.admin_events_create} element={<EventFormAdminPage />} />
      <Route path={ROUTES.frontend.admin_events_edit} element={<EventFormAdminPage />} />
      <Route path={ROUTES.frontend.admin_information} element={<InformationAdminPage />} />
      <Route path={ROUTES.frontend.admin_information_create} element={<InformationFormAdminPage />} />
      <Route path={ROUTES.frontend.admin_information_edit} element={<InformationFormAdminPage />} />
    </Routes>
  );
}

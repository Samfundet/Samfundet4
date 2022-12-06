import { Route, Routes } from 'react-router-dom';
import { useGoatCounter } from '~/hooks';
import {
  ApiTestingPage,
  ComponentPage,
  GroupsPage,
  HealthPage,
  HomePage,
  InformationListPage,
  InformationPage,
  LoginPage,
  LychePage,
  SaksdokumenterPage,
} from '~/Pages';
import { ROUTES } from './routes';

export function AppRoutes() {
  // Must be called within <BrowserRouter> because it uses hook useLocation().
  useGoatCounter();

  return (
    <Routes>
      <Route path={ROUTES.frontend.home} element={<HomePage />} />
      <Route path={ROUTES.frontend.health} element={<HealthPage />} />
      <Route path={ROUTES.frontend.components} element={<ComponentPage />} />
      <Route path={ROUTES.frontend.login} element={<LoginPage />} />
      <Route path={ROUTES.frontend.api_testing} element={<ApiTestingPage />} />
      <Route path={ROUTES.frontend.lyche} element={<LychePage />} />
      <Route path={ROUTES.frontend.information_page_detail} element={<InformationPage />} />
      <Route path={ROUTES.frontend.information_page_list} element={<InformationListPage />} />
      <Route path={ROUTES.frontend.groups} element={<GroupsPage />} />
      <Route path={ROUTES.frontend.saksdokumenter} element={<SaksdokumenterPage />} />
    </Routes>
  );
}

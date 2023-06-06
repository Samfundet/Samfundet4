import { Route, Routes } from 'react-router-dom';
import {
  AboutPage,
  AdminPage,
  ApiTestingPage,
  ComponentPage,
  EventPage,
  EventsPage,
  GroupsPage,
  HealthPage,
  HomePage,
  InformationListPage,
  InformationPage,
  LoginPage,
  LychePage,
  NotFoundPage,
  RecruitmentPage,
  RouteOverviewPage,
  SaksdokumenterPage,
  SignUpPage,
} from '~/Pages';
import {
  ClosedPeriodAdminPage,
  ClosedPeriodFormAdminPage,
  EventCreatorAdminPage,
  EventsAdminPage,
  GangsAdminPage,
  GangsFormAdminPage,
  ImageAdminPage,
  ImageFormAdminPage,
  InformationAdminPage,
  InformationFormAdminPage,
  OpeningHoursAdminPage,
  RecruitmentAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangOverviewPage,
  RecruitmentPositionFormAdminPage,
  SaksdokumentFormAdminPage,
} from '~/PagesAdmin';
import { useGoatCounter } from '~/hooks';
import { SamfOutlet } from './Components/SamfOutlet';
import { SultenOutlet } from './Components/SultenOutlet';
import { VenuePage } from './Pages/VenuePage';
import { AdminLayout } from './PagesAdmin/AdminLayout/AdminLayout';
import { RecruitmentFormAdminPage } from './PagesAdmin/RecruitmentFormAdminPage';
import { SaksdokumentAdminPage } from './PagesAdmin/SaksdokumentAdminPage';
import { ROUTES } from './routes';

export function AppRoutes() {
  // Must be called within <BrowserRouter> because it uses hook useLocation().
  useGoatCounter();

  return (
    <Routes>
      <Route element={<SamfOutlet />}>
        {/* 
          PUBLIC ROUTES
        */}
        <Route path={ROUTES.frontend.home} element={<HomePage />} />
        <Route path={ROUTES.frontend.about} element={<AboutPage />} />
        <Route path={ROUTES.frontend.venues} element={<VenuePage />} />
        <Route path={ROUTES.frontend.health} element={<HealthPage />} />
        <Route path={ROUTES.frontend.components} element={<ComponentPage />} />
        <Route path={ROUTES.frontend.login} element={<LoginPage />} />
        <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
        <Route path={ROUTES.frontend.api_testing} element={<ApiTestingPage />} />
        <Route path={ROUTES.frontend.information_page_detail} element={<InformationPage />} />
        <Route path={ROUTES.frontend.information_page_list} element={<InformationListPage />} />
        <Route path={ROUTES.frontend.groups} element={<GroupsPage />} />
        <Route path={ROUTES.frontend.events} element={<EventsPage />} />
        <Route path={ROUTES.frontend.event} element={<EventPage />} />
        <Route path={ROUTES.frontend.saksdokumenter} element={<SaksdokumenterPage />} />
        <Route path={ROUTES.frontend.route_overview} element={<RouteOverviewPage />} />
        <Route path={ROUTES.frontend.recruitment} element={<RecruitmentPage />} />
      </Route>
      {/* 
            ADMIN ROUTES
      */}
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.frontend.admin} element={<AdminPage />} />
        {/* Gangs */}
        <Route path={ROUTES.frontend.admin_gangs} element={<GangsAdminPage />} />
        <Route path={ROUTES.frontend.admin_gangs_create} element={<GangsFormAdminPage />} />
        <Route path={ROUTES.frontend.admin_gangs_edit} element={<GangsFormAdminPage />} />
        {/* Events */}
        <Route path={ROUTES.frontend.admin_events} element={<EventsAdminPage />} />
        <Route path={ROUTES.frontend.admin_events_create} element={<EventCreatorAdminPage />} />
        <Route path={ROUTES.frontend.admin_events_edit} element={<EventCreatorAdminPage />} />
        {/* 
          Info pages 
          NOTE: edit/create uses custom views
        */}
        <Route path={ROUTES.frontend.admin_information} element={<InformationAdminPage />} />
        {/* Opening hours */}
        <Route path={ROUTES.frontend.admin_opening_hours} element={<OpeningHoursAdminPage />} />
        {/* Closed period */}
        <Route path={ROUTES.frontend.admin_closed} element={<ClosedPeriodAdminPage />} />
        <Route path={ROUTES.frontend.admin_closed_create} element={<ClosedPeriodFormAdminPage />} />
        <Route path={ROUTES.frontend.admin_closed_edit} element={<ClosedPeriodFormAdminPage />} />
        {/* Images */}
        <Route path={ROUTES.frontend.admin_images} element={<ImageAdminPage />} />
        <Route path={ROUTES.frontend.admin_images_create} element={<ImageFormAdminPage />} />
        {/* Saksdokumenter */}
        <Route path={ROUTES.frontend.admin_saksdokumenter} element={<SaksdokumentAdminPage />} />
        <Route path={ROUTES.frontend.admin_saksdokumenter_create} element={<SaksdokumentFormAdminPage />} />
        <Route path={ROUTES.frontend.admin_saksdokumenter_edit} element={<SaksdokumentFormAdminPage />} />
        {/* Recruitment */}
        <Route path={ROUTES.frontend.admin_recruitment} element={<RecruitmentAdminPage />} />
        <Route path={ROUTES.frontend.admin_recruitment_create} element={<RecruitmentFormAdminPage />} />
        <Route path={ROUTES.frontend.admin_recruitment_edit} element={<RecruitmentFormAdminPage />} />
        <Route path={ROUTES.frontend.admin_recruitment_gang_overview} element={<RecruitmentGangOverviewPage />} />
        <Route path={ROUTES.frontend.admin_recruitment_gang_position_overview} element={<RecruitmentGangAdminPage />} />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_create}
          element={<RecruitmentPositionFormAdminPage />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_edit}
          element={<RecruitmentPositionFormAdminPage />}
        />
      </Route>
      {/* 
        Info pages
        Custom layout for edit/create
      */}
      <Route path={ROUTES.frontend.admin_information_create} element={<InformationFormAdminPage />} />
      <Route path={ROUTES.frontend.admin_information_edit} element={<InformationFormAdminPage />} />
      {/* 
            SULTEN ROUTES
      */}
      <Route element={<SultenOutlet />}>
        <Route path={ROUTES.frontend.sulten} element={<LychePage />} />
      </Route>
      {/* 
            404 NOT FOUND
      */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

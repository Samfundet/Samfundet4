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
  LycheContactPage,
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
import { ProtectedRoute } from './Components';
import { SamfOutlet } from './Components/SamfOutlet';
import { SultenOutlet } from './Components/SultenOutlet';
import { VenuePage } from './Pages/VenuePage';
import { AdminLayout } from './PagesAdmin/AdminLayout/AdminLayout';
import { RecruitmentFormAdminPage } from './PagesAdmin/RecruitmentFormAdminPage';
import { SaksdokumentAdminPage } from './PagesAdmin/SaksdokumentAdminPage';
import { PERM } from './permissions';
import { ROUTES } from './routes';
import { RecruitmentPositionOverviewPage } from './PagesAdmin/RecruitmentPositionOverviewPage/RecruitmentPositionOverviewPage';

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
      <Route element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={AdminLayout} />}>
        <Route
          path={ROUTES.frontend.admin}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={AdminPage} />}
        />
        {/* Gangs */}
        <Route
          path={ROUTES.frontend.admin_gangs}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={GangsAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_gangs_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_GANG]} Page={GangsFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_gangs_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_GANG]} Page={GangsFormAdminPage} />}
        />
        {/* Events */}
        <Route
          path={ROUTES.frontend.admin_events}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_EVENT]} Page={EventsAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_events_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_EVENT]} Page={EventCreatorAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_events_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_EVENT]} Page={EventCreatorAdminPage} />}
        />
        {/* 
          Info pages 
          NOTE: edit/create uses custom views
        */}
        <Route
          path={ROUTES.frontend.admin_information}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]} Page={InformationAdminPage} />}
        />
        {/* Opening hours, TODO ADD OPENING HOURS PERMISSIONS*/}
        <Route
          path={ROUTES.frontend.admin_opening_hours}
          element={<ProtectedRoute perms={[]} Page={OpeningHoursAdminPage} />}
        />
        {/* Closed period */}
        <Route
          path={ROUTES.frontend.admin_closed}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_CLOSEDPERIOD]} Page={ClosedPeriodAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_closed_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_CLOSEDPERIOD]} Page={ClosedPeriodFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_closed_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]} Page={ClosedPeriodFormAdminPage} />}
        />
        {/* Images */}
        <Route
          path={ROUTES.frontend.admin_images}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_IMAGE]} Page={ImageAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_images_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_IMAGE]} Page={ImageFormAdminPage} />}
        />
        {/* Saksdokumenter */}
        <Route
          path={ROUTES.frontend.admin_saksdokumenter}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_SAKSDOKUMENT]} Page={SaksdokumentAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_saksdokumenter_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_SAKSDOKUMENT]} Page={SaksdokumentFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_saksdokumenter_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]} Page={SaksdokumentFormAdminPage} />}
        />
        {/* Recruitment */}
        <Route
          path={ROUTES.frontend.admin_recruitment}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} Page={RecruitmentAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
        />
        {/* TODO ADD PERMISSIONS */}
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_overview}
          element={<ProtectedRoute perms={[]} Page={RecruitmentGangOverviewPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_overview}
          element={<ProtectedRoute perms={[]} Page={RecruitmentGangAdminPage} />}
        />

        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_create}
          element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_applicants_overview}
          element={<ProtectedRoute perms={[]} Page={RecruitmentPositionOverviewPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_edit}
          element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
        />
        {/* 
        Info pages
        Custom layout for edit/create
      */}
        <Route
          path={ROUTES.frontend.admin_information_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_INFORMATIONPAGE]} Page={InformationFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_information_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE]} Page={InformationFormAdminPage} />}
        />
      </Route>
      {/* 
            SULTEN ROUTES
      */}
      <Route element={<SultenOutlet />}>
        <Route path={ROUTES.frontend.sulten} element={<LychePage />} />
        <Route path={ROUTES.frontend.sulten_contact} element={<LycheContactPage />} />
      </Route>

      {/* 
            404 NOT FOUND
      */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

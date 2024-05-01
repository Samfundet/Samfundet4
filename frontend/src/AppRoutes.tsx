import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import {
  AboutPage,
  AdminPage,
  ApiTestingPage,
  ApplicantApplicationOverviewPage,
  ComponentPage,
  EventPage,
  EventsPage,
  GroupsPage,
  HealthPage,
  HomePage,
  InformationListPage,
  InformationPage,
  LoginPage,
  LycheAboutPage,
  LycheContactPage,
  LycheHomePage,
  LycheMenuPage,
  LycheReservationPage,
  NotFoundPage,
  RecruitmentAdmissionFormPage,
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
  InterviewNotesPage,
  OpeningHoursAdminPage,
  RecruitmentAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangOverviewPage,
  RecruitmentPositionFormAdminPage,
  RecruitmentUsersWithoutInterview,
  SaksdokumentFormAdminPage,
  SultenMenuAdminPage,
} from '~/PagesAdmin';
import { ImpersonateUserAdminPage } from '~/PagesAdmin/ImpersonateUserAdminPage/ImpersonateUserAdminPage';
import { Link, ProtectedRoute, SamfOutlet, SultenOutlet } from './Components';
import { VenuePage } from './Pages/VenuePage';
import { AdminLayout } from './PagesAdmin/AdminLayout/AdminLayout';
import { RecruitmentFormAdminPage } from './PagesAdmin/RecruitmentFormAdminPage';
import {
  RecruitmentPositionOverviewPage
} from './PagesAdmin/RecruitmentPositionOverviewPage/RecruitmentPositionOverviewPage';
import { SaksdokumentAdminPage } from './PagesAdmin/SaksdokumentAdminPage';
import { PERM } from './permissions';
import { ROUTES } from './routes';
import { App } from '~/App';
import { lowerCapitalize } from '~/utils';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
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
        <Route path={ROUTES.frontend.recruitment_application} element={<RecruitmentAdmissionFormPage />} />
        <Route
          path={ROUTES.frontend.recruitment_application_overview}
          element={<ApplicantApplicationOverviewPage />} />
        <Route path={ROUTES.frontend.contact} element={<></>} />
      </Route>
      {/*
            ADMIN ROUTES
      */}
      <Route element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={AdminLayout} />}>
        {/* TODO PERMISSION FOR IMPERSONATE */}
        <Route
          path={ROUTES.frontend.admin_impersonate}
          element={<ProtectedRoute perms={[]} Page={ImpersonateUserAdminPage} />}
        />
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
          handle={{
            crumb: () => (
              <Link url={ROUTES.frontend.admin_events_edit}>
                {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`)}
              </Link>
            ),
          }}
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
        <Route
          path={ROUTES.frontend.admin_sulten_menu}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_MENU]} Page={SultenMenuAdminPage} />}
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
        <Route
          path={ROUTES.frontend.admin_recruitment_users_without_interview}
          element={<RecruitmentUsersWithoutInterview />}
        />
        <Route
          path={ROUTES.frontend.admin_recruitment_gang_position_applicants_interview_notes}
          element={<InterviewNotesPage />}
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
        <Route path={ROUTES.frontend.sulten} element={<LycheHomePage />} />
        <Route path={ROUTES.frontend.sulten_about} element={<LycheAboutPage />} />
        <Route path={ROUTES.frontend.sulten_menu} element={<LycheMenuPage />} />
        <Route path={ROUTES.frontend.sulten_contact} element={<LycheContactPage />} />
        <Route path={ROUTES.frontend.sulten_reservation} element={<LycheReservationPage />} />
      </Route>

      {/*
            404 NOT FOUND
      */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

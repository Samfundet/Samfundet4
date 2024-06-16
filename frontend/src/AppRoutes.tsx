import { createBrowserRouter, createRoutesFromElements, Outlet, Route } from 'react-router-dom';
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
  MembershipPage,
  NotFoundPage,
  RecruitmentAdmissionFormPage,
  RecruitmentPage,
  RouteOverviewPage,
  SaksdokumenterPage,
  SignUpPage,
  VenuePage,
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
  RecruitmentPositionOverviewPage,
  RecruitmentUsersWithoutInterview,
  SaksdokumentFormAdminPage,
  SaksdokumentAdminPage,
  RecruitmentFormAdminPage,
  SultenReservationAdminPage,
  SultenMenuAdminPage,
  AdminLayout,
  ImpersonateUserAdminPage,
  SultenMenuItemFormAdminPage,
} from '~/PagesAdmin';
import { Link, ProtectedRoute, SamfOutlet, SultenOutlet } from './Components';
import { PERM } from './permissions';
import { ROUTES } from './routes';
import { App } from '~/App';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';

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
        <Route path={ROUTES.frontend.recruitment_application_overview} element={<ApplicantApplicationOverviewPage />} />
        <Route path={ROUTES.frontend.membership} element={<MembershipPage />} />
        <Route path={ROUTES.frontend.contact} element={<></>} />
        <Route path={ROUTES.frontend.luka} element={<></>} />
      </Route>
      {/*
            ADMIN ROUTES
      */}
      <Route
        handle={{ crumb: () => <Link url={ROUTES.frontend.admin}>{t(KEY.control_panel_title)}</Link> }}
        element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={AdminLayout} />}
      >
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
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_gangs}>{t(KEY.common_gangs)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_gangs}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_GANG]} Page={GangsAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_gangs_create}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_gangs_create}>{t(KEY.common_create)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_GANG]} Page={GangsFormAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_gangs_edit}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_GANG]} Page={GangsFormAdminPage} />}
            loader={({ params }) => {
              // TODO: Fetch gang to get name, also pass it to Page (may need to use useRouteLoaderData hook?)
              return { id: params.id };
            }}
            handle={{
              crumb: ({ id }: { id: string }) => (
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.admin_gangs_edit,
                    urlParams: { id },
                  })}
                >
                  {t(KEY.common_edit)}
                </Link>
              ),
            }}
          />
        </Route>
        {/* Events */}
        <Route
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_events}>{t(KEY.common_events)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_events}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_EVENT]} Page={EventsAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_events_create}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_events_create}>{t(KEY.common_create)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_EVENT]} Page={EventCreatorAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_events_edit}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_events_edit}>{t(KEY.common_edit)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_EVENT]} Page={EventCreatorAdminPage} />}
          />
        </Route>
        {/*
          Info pages
          NOTE: edit/create uses custom views
        */}
        <Route
          path={ROUTES.frontend.admin_information}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_information}>{t(KEY.information_page)}</Link> }}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]} Page={InformationAdminPage} />}
        />
        {/* Opening hours, TODO ADD OPENING HOURS PERMISSIONS*/}
        <Route
          path={ROUTES.frontend.admin_opening_hours}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_opening_hours}>{t(KEY.common_opening_hours)}</Link> }}
          element={<ProtectedRoute perms={[]} Page={OpeningHoursAdminPage} />}
        />
        {/* Closed period */}
        <Route
          element={<Outlet />}
          handle={{
            crumb: () => <Link url={ROUTES.frontend.admin_closed}>{t(KEY.command_menu_shortcut_closed)}</Link>,
          }}
        >
          <Route
            path={ROUTES.frontend.admin_closed}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_CLOSEDPERIOD]} Page={ClosedPeriodAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_closed_create}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_closed_create}>{t(KEY.common_create)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_CLOSEDPERIOD]} Page={ClosedPeriodFormAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_closed_edit}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_closed_edit}>{t(KEY.common_edit)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]} Page={ClosedPeriodFormAdminPage} />}
          />
        </Route>
        {/* Images */}
        <Route
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_images}>{t(KEY.admin_images_title)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_images}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_IMAGE]} Page={ImageAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_images_create}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_images_create}>{t(KEY.common_create)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_IMAGE]} Page={ImageFormAdminPage} />}
          />
        </Route>
        {/* Saksdokumenter */}
        <Route
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_saksdokumenter}>{t(KEY.admin_saksdokument)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_saksdokumenter}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_SAKSDOKUMENT]} Page={SaksdokumentAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_saksdokumenter_create}
            handle={{
              crumb: () => <Link url={ROUTES.frontend.admin_saksdokumenter_create}>{t(KEY.common_create)}</Link>,
            }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_SAKSDOKUMENT]} Page={SaksdokumentFormAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_saksdokumenter_edit}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_saksdokumenter_edit}>{t(KEY.common_edit)}</Link> }}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]} Page={SaksdokumentFormAdminPage} />}
          />
        </Route>
        <Route
          path={ROUTES.frontend.admin_sulten_menu}
          handle={{
            crumb: () => (
              <Link url={ROUTES.frontend.admin_sulten_menu}>
                {t(KEY.common_sulten)} {t(KEY.common_menu)}
              </Link>
            ),
          }}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_MENU]} Page={SultenMenuAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_sulten_menuitem_create}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_MENUITEM]} Page={SultenMenuItemFormAdminPage} />}
        />
        <Route
          path={ROUTES.frontend.admin_sulten_menuitem_edit}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_MENUITEM]} Page={SultenMenuItemFormAdminPage} />}
        />
        {/* Recruitment */}
        <Route
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment}>{t(KEY.common_recruitment)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_recruitment}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} Page={RecruitmentAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_create}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment_create}>{t(KEY.common_create)}</Link> }}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_edit}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
            loader={({ params }) => {
              // TODO: Fetch recruitment to get name, also pass it to Page (may need to use useRouteLoaderData hook?)
              return { id: params.id };
            }}
            handle={{
              crumb: ({ id }: { id: string }) => (
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.admin_recruitment_edit,
                    urlParams: { id },
                  })}
                >
                  {t(KEY.common_edit)}
                </Link>
              ),
            }}
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
            element={<Outlet />}
            loader={({ params }) => {
              // TODO: Fetch recruitment to get name, also pass it to Page (may need to use useRouteLoaderData hook?)
              return { recruitmentId: params.recruitmentId };
            }}
            handle={{
              crumb: ({ recruitmentId }: { recruitmentId: string }) => (
                <Link
                  url={reverse({
                    pattern: ROUTES.frontend.admin_recruitment_gang_overview,
                    urlParams: { recruitmentId },
                  })}
                >
                  {recruitmentId}
                </Link>
              ),
            }}
          >
            <Route
              path={ROUTES.frontend.admin_recruitment_gang_overview}
              element={<ProtectedRoute perms={[]} Page={RecruitmentGangOverviewPage} />}
            />

            <Route
              element={<Outlet />}
              loader={({ params }) => {
                // TODO: Fetch gang to get name, also pass it to Page (may need to use useRouteLoaderData hook?)
                return { recruitmentId: params.recruitmentId, gangId: params.gangId };
              }}
              handle={{
                crumb: ({ recruitmentId, gangId }: { recruitmentId: string; gangId: string }) => (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
                      urlParams: { recruitmentId, gangId },
                    })}
                  >
                    {gangId}
                  </Link>
                ),
              }}
            >
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_overview}
                element={<ProtectedRoute perms={[]} Page={RecruitmentGangAdminPage} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_create}
                element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_edit}
                element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_applicants_overview}
                loader={({ params }) => {
                  const { recruitmentId, gangId, positionId } = params;
                  // TODO: Fetch position to get name, also pass it to Page (may need to use useRouteLoaderData hook?)
                  return { recruitmentId, gangId, positionId };
                }}
                handle={{
                  crumb: ({
                    recruitmentId,
                    gangId,
                    positionId,
                  }: {
                    recruitmentId: string;
                    gangId: string;
                    positionId: string;
                  }) => (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
                        urlParams: { recruitmentId, gangId, positionId },
                      })}
                    >
                      {positionId}
                    </Link>
                  ),
                }}
                element={<ProtectedRoute perms={[]} Page={RecruitmentPositionOverviewPage} />}
              />
            </Route>
          </Route>
        </Route>
        <Route
          path={ROUTES.frontend.admin_sulten_reservations}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RESERVATION]} Page={SultenReservationAdminPage} />}
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
      <Route path={ROUTES.frontend.not_found} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

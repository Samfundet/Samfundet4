import { createBrowserRouter, createRoutesFromElements, Outlet, Route } from 'react-router-dom';
import {
  AdminPage,
  RecruitmentApplicationsOverviewPage,
  LoginPage,
  NotFoundPage,
  RecruitmentAdmissionFormPage,
  RecruitmentPage,
  SignUpPage,
} from '~/Pages';
import {
  GangsAdminPage,
  GangsFormAdminPage,
  InterviewNotesPage,
  RecruitmentAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangOverviewPage,
  RecruitmentPositionFormAdminPage,
  RecruitmentPositionOverviewPage,
  RecruitmentUsersWithoutInterviewGangPage,
  RecruitmentApplicantAdminPage,
  RecruitmentFormAdminPage,
  AdminLayout,
  ImpersonateUserAdminPage,
} from '~/PagesAdmin';
import { Link, ProtectedRoute, SamfOutlet } from './Components';
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
        <Route path={ROUTES.frontend.login} element={<LoginPage />} />
        <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
        <Route path={ROUTES.frontend.recruitment} element={<RecruitmentPage />} />
        <Route path={ROUTES.frontend.recruitment_application} element={<RecruitmentAdmissionFormPage />} />
        <Route
          path={ROUTES.frontend.recruitment_application_overview}
          element={<RecruitmentApplicationsOverviewPage />}
        />
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
            path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
            element={<RecruitmentUsersWithoutInterviewGangPage />}
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
          path={ROUTES.frontend.admin_recruitment_applicant}
          element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} Page={RecruitmentApplicantAdminPage} />}
        />
      </Route>
      {/*
            404 NOT FOUND
      */}
      <Route path={ROUTES.frontend.not_found} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

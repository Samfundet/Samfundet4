import { createBrowserRouter, createRoutesFromElements, Outlet, Route } from 'react-router-dom';
import {
  AdminPage,
  RecruitmentApplicationsOverviewPage,
  LoginPage,
  NotFoundPage,
  RecruitmentApplicationFormPage,
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
  RecruitmentOverviewPage,
  AdminLayout,
  ImpersonateUserAdminPage,
} from '~/PagesAdmin';
import { Link, ProtectedRoute, SamfOutlet } from '~/Components';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';

import { App } from '~/App';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { dbT, lowerCapitalize } from '~/utils';
import {
  type GangLoader,
  type PositionLoader,
  type RecruitmentLoader,
  recruitmentGangLoader,
  recruitmentGangPositionLoader,
  recruitmentLoader,
} from '~/router/loaders';

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
        <Route path={ROUTES.frontend.recruitment_application} element={<RecruitmentApplicationFormPage />} />
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
            path={ROUTES.frontend.admin_recruitment_overview}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} Page={RecruitmentOverviewPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_create}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_ADD_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment_create}>{t(KEY.common_create)}</Link> }}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_applicant}
            element={<ProtectedRoute perms={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} Page={RecruitmentApplicantAdminPage} />}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_gang_position_applicants_interview_notes}
            element={<InterviewNotesPage />}
          />
          {/* Specific recruitment */}
          {/* TODO ADD PERMISSIONS */}
          <Route
            element={<Outlet />}
            id="recruitment"
            loader={recruitmentLoader}
            handle={{
              crumb: ({ recruitment }: RecruitmentLoader) => {
                if (!recruitment) return <span>{t(KEY.common_unknown)}</span>;
                return (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_recruitment_gang_overview,
                      urlParams: { recruitmentId: recruitment.id },
                    })}
                  >
                    {dbT(recruitment, 'name')}
                  </Link>
                );
              },
            }}
          >
            <Route
              path={ROUTES.frontend.admin_recruitment_gang_overview}
              element={<ProtectedRoute perms={[]} Page={RecruitmentGangOverviewPage} />}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_edit}
              element={<ProtectedRoute perms={[PERM.SAMFUNDET_CHANGE_RECRUITMENT]} Page={RecruitmentFormAdminPage} />}
              loader={recruitmentLoader}
              handle={{
                crumb: ({ recruitment }: RecruitmentLoader) => {
                  if (!recruitment) return <span>{t(KEY.common_unknown)}</span>;
                  return (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_edit,
                        urlParams: { recruitmentId: recruitment.id },
                      })}
                    >
                      {t(KEY.common_edit)}
                    </Link>
                  );
                },
              }}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
              element={<RecruitmentUsersWithoutInterviewGangPage />}
              loader={recruitmentLoader}
              handle={{
                crumb: ({ recruitment }: RecruitmentLoader) => {
                  if (!recruitment) return <span>{t(KEY.common_unknown)}</span>;
                  return (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_users_without_interview,
                        urlParams: { recruitmentId: recruitment.id },
                      })}
                    >
                      {t(KEY.recruitment_show_applicants_without_interview)}
                    </Link>
                  );
                },
              }}
            />

            <Route
              element={<Outlet />}
              loader={recruitmentGangLoader}
              handle={{
                crumb: ({ recruitment, gang }: RecruitmentLoader & GangLoader) => {
                  if (!recruitment || !gang) return <span>{t(KEY.common_unknown)}</span>;
                  return (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
                        urlParams: { recruitmentId: recruitment.id, gangId: gang.id },
                      })}
                    >
                      {dbT(gang, 'name')}
                    </Link>
                  );
                },
              }}
            >
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_overview}
                element={<ProtectedRoute perms={[]} Page={RecruitmentGangAdminPage} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_create}
                element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
                loader={recruitmentGangLoader}
                handle={{
                  crumb: ({ recruitment, gang }: RecruitmentLoader & GangLoader) => {
                    if (!recruitment || !gang) return <span>{t(KEY.common_unknown)}</span>;
                    return (
                      <Link
                        url={reverse({
                          pattern: ROUTES.frontend.admin_recruitment_gang_position_create,
                          urlParams: { recruitmentId: recruitment.id, gangId: gang.id },
                        })}
                      >
                        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.recruitment_position)}`)}
                      </Link>
                    );
                  },
                }}
              />
              {/* Position */}
              <Route
                element={<Outlet />}
                loader={recruitmentGangPositionLoader}
                handle={{
                  crumb: ({ recruitment, gang, position }: RecruitmentLoader & GangLoader & PositionLoader) => {
                    if (!recruitment || !gang || !position) return <span>{t(KEY.common_unknown)}</span>;
                    return (
                      <Link
                        url={reverse({
                          pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
                          urlParams: { recruitmentId: recruitment.id, gangId: gang.id, positionId: position.id },
                        })}
                      >
                        {dbT(position, 'name')}
                      </Link>
                    );
                  },
                }}
              >
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_applicants_overview}
                  element={<ProtectedRoute perms={[]} Page={RecruitmentPositionOverviewPage} />}
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_edit}
                  element={<ProtectedRoute perms={[]} Page={RecruitmentPositionFormAdminPage} />}
                  loader={recruitmentGangPositionLoader}
                  handle={{
                    crumb: ({ recruitment, gang, position }: RecruitmentLoader & GangLoader & PositionLoader) => {
                      if (!recruitment || !gang || !position) return <span>{t(KEY.common_unknown)}</span>;
                      return (
                        <Link
                          url={reverse({
                            pattern: ROUTES.frontend.admin_recruitment_gang_position_edit,
                            urlParams: { recruitmentId: recruitment.id, gangId: gang.id, positionId: position.id },
                          })}
                        >
                          {t(KEY.common_edit)}
                        </Link>
                      );
                    },
                  }}
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      {/*
            404 NOT FOUND
      */}
      <Route path={ROUTES.frontend.not_found} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

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
import { Link, PermissionRoute, ProtectedRoute, SamfOutlet } from '~/Components';
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
        <Route element={<ProtectedRoute authState={false} element={<Outlet />} />}>
          <Route path={ROUTES.frontend.login} element={<LoginPage />} />
          <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
        </Route>
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
        element={<AdminLayout />}
      >
        {/* TODO PERMISSION FOR IMPERSONATE */}
        <Route
          path={ROUTES.frontend.admin_impersonate}
          element={<PermissionRoute required={[]} element={<ImpersonateUserAdminPage />} />}
        />
        <Route
          path={ROUTES.frontend.admin}
          element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_GANG]} element={<AdminPage />} />}
        />
        {/* Gangs */}
        <Route
          element={<Outlet />}
          handle={{ crumb: () => <Link url={ROUTES.frontend.admin_gangs}>{t(KEY.common_gangs)}</Link> }}
        >
          <Route
            path={ROUTES.frontend.admin_gangs}
            element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_GANG]} element={<GangsAdminPage />} />}
          />
          <Route
            path={ROUTES.frontend.admin_gangs_create}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_gangs_create}>{t(KEY.common_create)}</Link> }}
            element={<PermissionRoute required={[PERM.SAMFUNDET_ADD_GANG]} element={<GangsFormAdminPage />} />}
          />
          <Route
            path={ROUTES.frontend.admin_gangs_edit}
            element={<PermissionRoute required={[PERM.SAMFUNDET_CHANGE_GANG]} element={<GangsFormAdminPage />} />}
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
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} element={<RecruitmentAdminPage />} />
            }
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_overview}
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} element={<RecruitmentOverviewPage />} />
            }
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_create}
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_ADD_RECRUITMENT]} element={<RecruitmentFormAdminPage />} />
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment_create}>{t(KEY.common_create)}</Link> }}
          />
          <Route
            path={ROUTES.frontend.admin_recruitment_applicant}
            element={
              <PermissionRoute
                required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                element={<RecruitmentApplicantAdminPage />}
              />
            }
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
              element={<PermissionRoute required={[]} element={<RecruitmentGangOverviewPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_edit}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT]}
                  element={<RecruitmentFormAdminPage />}
                />
              }
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
                element={<PermissionRoute required={[]} element={<RecruitmentGangAdminPage />} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_position_create}
                element={<PermissionRoute required={[]} element={<RecruitmentPositionFormAdminPage />} />}
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
                  element={<PermissionRoute required={[]} element={<RecruitmentPositionOverviewPage />} />}
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_edit}
                  element={<PermissionRoute required={[]} element={<RecruitmentPositionFormAdminPage />} />}
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

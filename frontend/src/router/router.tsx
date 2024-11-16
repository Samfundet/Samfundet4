import { Outlet, Route, type UIMatch, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Link, PermissionRoute, ProtectedRoute, RootErrorBoundary, SamfOutlet } from '~/Components';
import {
  AdminPage,
  ContributorsPage,
  LoginPage,
  NotFoundPage,
  OrganizationRecruitmentPage,
  RecruitmentApplicationFormPage,
  RecruitmentApplicationsOverviewPage,
  RecruitmentPage,
  SignUpPage,
} from '~/Pages';
import {
  AdminLayout,
  CreateInterviewRoomPage,
  GangsAdminPage,
  GangsFormAdminPage,
  InterviewNotesPage,
  RecruitmentAdminPage,
  RecruitmentApplicantAdminPage,
  RecruitmentFormAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangAllApplicantsAdminPage,
  RecruitmentGangOverviewPage,
  RecruitmentOpenToOtherPositionsPage,
  RecruitmentOverviewPage,
  RecruitmentPositionFormAdminPage,
  RecruitmentPositionOverviewPage,
  RecruitmentSeparatePositionFormAdminPage,
  RecruitmentUnprocessedApplicantsPage,
  RecruitmentUsersWithoutInterviewGangPage,
  RecruitmentUsersWithoutThreeInterviewCriteriaPage,
  RoleAdminPage,
  RoleFormAdminPage,
  RolesAdminPage,
  RoomAdminPage,
  UsersAdminPage,
} from '~/PagesAdmin';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';

import { t } from 'i18next';
import { App } from '~/App';
import { DynamicOrgOutlet } from '~/Components/DynamicOrgOutlet/DynamicOrgOutlet';
import { RecruitmentRecruiterDashboardPage } from '~/PagesAdmin/RecruitmentRecruiterDashboardPage/RecruitmentRecruiterDashboardPage';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import {
  type GangLoader,
  type PositionLoader,
  type RecruitmentLoader,
  type RoleLoader,
  type SeparatePositionLoader,
  gangLoader,
  recruitmentGangLoader,
  recruitmentGangPositionLoader,
  recruitmentLoader,
  roleLoader,
  separatePositionLoader,
} from '~/router/loaders';
import { dbT, lowerCapitalize } from '~/utils';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<SamfOutlet />}>
        {/*
          PUBLIC ROUTES
        */}
        <Route element={<Outlet />} errorElement={<RootErrorBoundary />}>
          <Route element={<ProtectedRoute authState={false} element={<Outlet />} />}>
            <Route path={ROUTES.frontend.login} element={<LoginPage />} />
            <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
          </Route>
          <Route path={ROUTES.frontend.contributors} element={<ContributorsPage />} />
          {/* Recruitment */}
          <Route path={ROUTES.frontend.recruitment} element={<RecruitmentPage />} />
        </Route>
      </Route>
      {/* Specific recruitment */}
      <Route element={<DynamicOrgOutlet />} id="publicRecruitment" loader={recruitmentLoader}>
        <Route path={ROUTES.frontend.recruitment_application} element={<RecruitmentApplicationFormPage />} />
        <Route
          path={ROUTES.frontend.recruitment_application_overview}
          element={<RecruitmentApplicationsOverviewPage />}
        />
        <Route path={ROUTES.frontend.organization_recruitment} element={<OrganizationRecruitmentPage />} />
      </Route>
      {/*
            ADMIN ROUTES
      */}
      <Route
        handle={{ crumb: () => <Link url={ROUTES.frontend.admin}>{t(KEY.control_panel_title)}</Link> }}
        element={<AdminLayout />}
      >
        <Route element={<Outlet />} errorElement={<RootErrorBoundary />}>
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
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={<PermissionRoute required={[PERM.SAMFUNDET_ADD_GANG]} element={<GangsFormAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_gangs_edit}
              element={<PermissionRoute required={[PERM.SAMFUNDET_CHANGE_GANG]} element={<GangsFormAdminPage />} />}
              loader={gangLoader}
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
              }}
            />
          </Route>
          {/* Users */}
          <Route
            element={<Outlet />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_users}>{t(KEY.common_users)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_users}
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_USER]} element={<UsersAdminPage />} />}
            />
          </Route>
          {/* Roles */}
          <Route
            element={<Outlet />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_roles}>{t(KEY.common_roles)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_roles}
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_ROLE]} element={<RolesAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_roles_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={<PermissionRoute required={[PERM.SAMFUNDET_ADD_ROLE]} element={<RoleFormAdminPage />} />}
            />
            <Route
              id="role"
              element={<Outlet />}
              loader={roleLoader}
              handle={{
                crumb: (_: UIMatch, { role }: RoleLoader) => (
                  <Link url={reverse({ pattern: ROUTES.frontend.admin_roles_view, urlParams: { roleId: role?.id } })}>
                    {role?.name}
                  </Link>
                ),
              }}
            >
              <Route
                path={ROUTES.frontend.admin_roles_view}
                element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_ROLE]} element={<RoleAdminPage />} />}
              />
              <Route
                path={ROUTES.frontend.admin_roles_edit}
                element={<PermissionRoute required={[PERM.SAMFUNDET_CHANGE_ROLE]} element={<RoleFormAdminPage />} />}
                handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              />
            </Route>
          </Route>
          {/* Recruitment */}
          <Route
            element={<Outlet />}
            path={ROUTES.frontend.admin_recruitment}
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
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_gang_all_applications}
              element={<RecruitmentGangAllApplicantsAdminPage />}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
              element={<RecruitmentUsersWithoutInterviewGangPage />}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_users_three_interview_criteria}
              element={<RecruitmentUsersWithoutThreeInterviewCriteriaPage />}
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
                crumb: ({ params }: UIMatch, { recruitment }: RecruitmentLoader) => (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_recruitment_gang_overview,
                      urlParams: params,
                    })}
                  >
                    {recruitment ? dbT(recruitment, 'name') : t(KEY.common_unknown)}
                  </Link>
                ),
              }}
            >
              <Route
                path={ROUTES.frontend.admin_recruitment_edit}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT]}
                    element={<RecruitmentFormAdminPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_recruiter_dashboard}
                element={<RecruitmentRecruiterDashboardPage />}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_recruiter_dashboard)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_separateposition_create}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_ADD_RECRUITMENTSEPARATEPOSITION]}
                    element={<RecruitmentSeparatePositionFormAdminPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>
                      {t(KEY.common_create)} {t(KEY.recruitment_gangs_with_separate_positions)}
                    </Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_separateposition_edit}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENTSEPARATEPOSITION]}
                    element={<RecruitmentSeparatePositionFormAdminPage />}
                  />
                }
                loader={separatePositionLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch, { separatePosition }: SeparatePositionLoader) => (
                    <Link url={pathname}>
                      {t(KEY.common_edit)} {t(KEY.recruitment_gangs_with_separate_positions)} -{' '}
                      {separatePosition ? dbT(separatePosition, 'name') : t(KEY.common_unknown)}
                    </Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_show_unprocessed_applicants}
                element={<RecruitmentUnprocessedApplicantsPage />}
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_show_unprocessed_applicants)}</Link>
                  ),
                }}
              />

              <Route
                path={ROUTES.frontend.admin_recruitment_users_without_interview}
                element={<RecruitmentUsersWithoutInterviewGangPage />}
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_show_applicants_without_interview)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_room_overview}
                element={<RoomAdminPage />}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_applet_room_overview)}</Link>
                  ),
                }}
              />
              <Route path={ROUTES.frontend.admin_recruitment_room_create} element={<CreateInterviewRoomPage />} />
              <Route path={ROUTES.frontend.admin_recruitment_room_edit} element={<CreateInterviewRoomPage />} />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_overview}
                element={<PermissionRoute required={[]} element={<RecruitmentGangOverviewPage />} />}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
                element={<RecruitmentUsersWithoutInterviewGangPage />}
                loader={recruitmentGangLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_show_applicants_without_interview)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_open_to_other_positions}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                    element={<RecruitmentOpenToOtherPositionsPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_applicants_open_to_other_positions)}</Link>
                  ),
                }}
              />
              <Route
                element={<Outlet />}
                loader={gangLoader}
                handle={{
                  crumb: ({ params }: UIMatch, { gang }: GangLoader) => (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
                        urlParams: params,
                      })}
                    >
                      {gang ? dbT(gang, 'name') : t(KEY.common_unknown)}
                    </Link>
                  ),
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
                    crumb: ({ pathname }: UIMatch) => (
                      <Link url={pathname}>
                        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.recruitment_position)}`)}
                      </Link>
                    ),
                  }}
                />
                {/* Position */}
                <Route
                  element={<Outlet />}
                  loader={recruitmentGangPositionLoader}
                  handle={{
                    crumb: ({ params }: UIMatch, { position }: RecruitmentLoader & GangLoader & PositionLoader) => (
                      <Link
                        url={reverse({
                          pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
                          urlParams: params,
                        })}
                      >
                        {position ? dbT(position, 'name') : t(KEY.common_unknown)}
                      </Link>
                    ),
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
                      crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
                    }}
                  />
                </Route>
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

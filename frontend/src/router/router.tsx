import { Outlet, Route, type UIMatch, createBrowserRouter, createRoutesFromElements } from 'react-router';
import {
  Link,
  PermissionRoute,
  ProtectedRoute,
  RootErrorBoundary,
  SamfOutlet,
  SiteFeatureGate,
  SultenOutlet,
} from '~/Components';
import {
  AboutPage,
  AdminPage,
  ApiTestingPage,
  ComponentPage,
  ContributorsPage,
  EventPage,
  EventsPage,
  GangsPage,
  HealthPage,
  HomePage,
  InformationListPage,
  InformationPage,
  LoginPage,
  LoginPickerPage,
  LycheAboutPage,
  LycheContactPage,
  LycheHomePage,
  LycheMenuPage,
  LycheReservationPage,
  MembershipPage,
  NotFoundPage,
  OrganizationRecruitmentPage,
  RecruitmentApplicationFormPage,
  RecruitmentApplicationsOverviewPage,
  RecruitmentPage,
  RouteOverviewPage,
  SaksdokumenterPage,
  SignUpPage,
  UserChangePasswordPage,
  VenuePage,
} from '~/Pages';
import {
  AdminLayout,
  ClosedPeriodAdminPage,
  ClosedPeriodFormAdminPage,
  CreateInterviewRoomPage,
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
  RecruitmentApplicantAdminPage,
  RecruitmentFormAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangAllApplicantsAdminPage,
  RecruitmentGangOverviewPage,
  RecruitmentInterviewAvailabilityAdminPage,
  RecruitmentOpenToOtherPositionsPage,
  RecruitmentOverviewPage,
  RecruitmentPositionFormAdminPage,
  RecruitmentPositionOverviewPage,
  RecruitmentRejectionMailPage,
  RecruitmentSeparatePositionFormAdminPage,
  RecruitmentUnprocessedApplicantsPage,
  RecruitmentUsersWithoutInterviewGangPage,
  RecruitmentUsersWithoutThreeInterviewCriteriaPage,
  RoleAdminPage,
  RoleFormAdminPage,
  RolesAdminPage,
  RoomAdminPage,
  SaksdokumentAdminPage,
  SaksdokumentFormAdminPage,
  SultenMenuAdminPage,
  SultenMenuItemFormAdminPage,
  SultenReservationAdminPage,
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
import { SAMF3_LOGIN_URL } from '~/routes/samf-three';
import { dbT, lowerCapitalize } from '~/utils';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<SamfOutlet />}>
        {/*
          PUBLIC ROUTES
        */}
        <Route element={<Outlet />} errorElement={<RootErrorBoundary />}>
          <Route path={ROUTES.frontend.home} element={<HomePage />} />
          <Route path={ROUTES.frontend.about} element={<AboutPage />} />
          <Route path={ROUTES.frontend.venues} element={<VenuePage />} />
          <Route path={ROUTES.frontend.health} element={<HealthPage />} />
          <Route path={ROUTES.frontend.components} element={<ComponentPage />} />
          <Route element={<ProtectedRoute authState={false} element={<Outlet />} />}>
            <Route path={ROUTES.frontend.login} element={<LoginPickerPage newRoute="/new-login" />} />
            <Route path={SAMF3_LOGIN_URL.login} element={<LoginPage />} />
            <Route path={ROUTES.frontend.new_login} element={<LoginPage />} />
            <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
          </Route>
          <Route path={ROUTES.frontend.api_testing} element={<ApiTestingPage />} />
          <Route path={ROUTES.frontend.information_page_detail} element={<InformationPage />} />
          <Route path={ROUTES.frontend.information_page_list} element={<InformationListPage />} />
          <Route path={ROUTES.frontend.gangs} element={<GangsPage />} />
          <Route path={ROUTES.frontend.events} element={<EventsPage />} />
          <Route path={ROUTES.frontend.event} element={<EventPage />} />
          <Route path={ROUTES.frontend.saksdokumenter} element={<SaksdokumenterPage />} />
          <Route path={ROUTES.frontend.route_overview} element={<RouteOverviewPage />} />
          <Route path={ROUTES.frontend.contributors} element={<ContributorsPage />} />
          <Route path={ROUTES.frontend.membership} element={<MembershipPage />} />
          <Route path={ROUTES.frontend.contact} element={<div />} />
          <Route path={ROUTES.frontend.luka} element={<div />} />
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
            element={
              <SiteFeatureGate feature="profile">
                <PermissionRoute requiredPermissions={[]} element={<AdminPage />} />
              </SiteFeatureGate>
            }
          />
          {/* User pages */}
          <Route
            path={ROUTES.frontend.user_change_password}
            element={
              <SiteFeatureGate feature="changePassword">
                <PermissionRoute element={<UserChangePasswordPage />} />
              </SiteFeatureGate>
            }
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.change_password)}</Link> }}
          />
          {/* Gangs */}
          <Route
            element={
              <SiteFeatureGate feature="gangs">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_gangs}>{t(KEY.common_gangs)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_gangs}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_GANG]}
                  element={<GangsAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_gangs_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_GANG]}
                  element={<GangsFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_gangs_edit}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_GANG]}
                  element={<GangsFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
              loader={gangLoader}
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
              }}
            />
          </Route>
          {/* Users */}
          <Route
            element={
              <SiteFeatureGate feature="users">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_users}>{t(KEY.common_users)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_users}
              element={
                <PermissionRoute requiredPermissions={[PERM.SAMFUNDET_VIEW_USER]} element={<UsersAdminPage />} />
              }
            />
          </Route>
          {/* Roles */}
          <Route
            element={
              <SiteFeatureGate feature="roles">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_roles}>{t(KEY.common_roles)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_roles}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_ROLE]}
                  element={<RolesAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_roles_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_ROLE]}
                  element={<RoleFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
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
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_ROLE]}
                    element={<RoleAdminPage />}
                    resolveWithRolePermissions={true}
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_roles_edit}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_ROLE]}
                    element={<RoleFormAdminPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              />
            </Route>
          </Route>
          {/* Events */}
          <Route
            element={
              <SiteFeatureGate feature="events">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_events}>{t(KEY.common_events)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_events}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_EVENT]}
                  element={<EventsAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_events_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_EVENT]}
                  element={<EventCreatorAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_events_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_EVENT]}
                  element={<EventCreatorAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
          </Route>

          {/* Opening hours*/}
          <Route
            path={ROUTES.frontend.admin_opening_hours}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_opening_hours)}</Link> }}
            element={
              <SiteFeatureGate feature="openingHours">
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_VENUE]}
                  element={<OpeningHoursAdminPage />}
                  resolveWithRolePermissions={true}
                />
              </SiteFeatureGate>
            }
          />
          {/* Closed period */}
          <Route
            element={
              <SiteFeatureGate feature="closedHours">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{
              crumb: () => <Link url={ROUTES.frontend.admin_closed}>{t(KEY.command_menu_shortcut_closed)}</Link>,
            }}
          >
            <Route
              path={ROUTES.frontend.admin_closed}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]}
                  element={<ClosedPeriodAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_CLOSEDPERIOD]}
                  element={<ClosedPeriodFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]}
                  element={<ClosedPeriodFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
          </Route>
          {/* Images */}
          <Route
            element={
              <SiteFeatureGate feature="images">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_images}>{t(KEY.admin_images_title)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_images}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_VIEW_IMAGE]}
                  element={<ImageAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_images_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_IMAGE]}
                  element={<ImageFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
          </Route>
          {/* Saksdokumenter */}
          <Route
            element={
              <SiteFeatureGate feature="documents">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{
              crumb: () => <Link url={ROUTES.frontend.admin_saksdokumenter}>{t(KEY.admin_saksdokument)}</Link>,
            }}
          >
            <Route
              path={ROUTES.frontend.admin_saksdokumenter}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]}
                  element={<SaksdokumentAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_saksdokumenter_create}
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link>,
              }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_SAKSDOKUMENT]}
                  element={<SaksdokumentFormAdminPage />}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_saksdokumenter_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]}
                  element={<SaksdokumentFormAdminPage />}
                />
              }
            />
          </Route>
          {/* Lyche Menu */}
          <Route
            element={
              <SiteFeatureGate feature="sulten">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{
              crumb: () => (
                <Link url={ROUTES.frontend.admin_sulten_menu}>
                  {t(KEY.common_sulten)} {t(KEY.common_menu)}
                </Link>
              ),
            }}
          >
            <Route
              path={ROUTES.frontend.admin_sulten_menu}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_MENU]}
                  element={<SultenMenuAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_sulten_menuitem_create}
              handle={{
                crumb: ({ pathname }: UIMatch) => (
                  <Link url={pathname}>
                    {t(KEY.common_create)} {t(KEY.sulten_dishes)}
                  </Link>
                ),
              }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_MENUITEM]}
                  element={<SultenMenuItemFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_sulten_menuitem_edit}
              handle={{
                crumb: ({ pathname }: UIMatch) => (
                  <Link url={pathname}>
                    {t(KEY.common_edit)} {t(KEY.sulten_dishes)}
                  </Link>
                ),
              }}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_CHANGE_MENUITEM]}
                  element={<SultenMenuItemFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
          </Route>
          {/* Recruitment */}
          <Route
            element={
              <SiteFeatureGate feature="recruitment">
                <Outlet />
              </SiteFeatureGate>
            }
            path={ROUTES.frontend.admin_recruitment}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment}>{t(KEY.common_recruitment)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_recruitment}
              element={
                <PermissionRoute
                  element={<RecruitmentAdminPage />}
                  requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                  resolveWithRolePermissions={true}
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_create}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_ADD_RECRUITMENT]}
                  element={<RecruitmentFormAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_applicant}
              element={
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENTAPPLICATION]}
                  element={<RecruitmentApplicantAdminPage />}
                  resolveWithRolePermissions={true}
                />
              }
            />
            {/* Specific recruitment */}
            <Route
              element={
                <SiteFeatureGate feature="recruitment">
                  <Outlet />
                </SiteFeatureGate>
              }
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
                path={ROUTES.frontend.admin_recruitment_overview}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENTSTATISTICS]}
                    element={<RecruitmentOverviewPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_overview)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_edit}
                element={<PermissionRoute element={<RecruitmentFormAdminPage />} />}
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_overview_rejection_email}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentRejectionMailPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{lowerCapitalize(t(KEY.recruitment_rejection_email))}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_recruiter_dashboard}
                element={
                  <PermissionRoute
                    element={<RecruitmentRecruiterDashboardPage />}
                    requiredPermissions={[PERM.SAMFUNDET_VIEW_INTERVIEW]}
                    resolveWithRolePermissions={true}
                  />
                }
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
                    requiredPermissions={[PERM.SAMFUNDET_ADD_RECRUITMENTSEPARATEPOSITION]}
                    element={<RecruitmentSeparatePositionFormAdminPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>
                      {t(KEY.common_create)} {t(KEY.recruitment_positions_with_separate_recruitment)}
                    </Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_separateposition_edit}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENTSEPARATEPOSITION]}
                    element={<RecruitmentSeparatePositionFormAdminPage />}
                  />
                }
                loader={separatePositionLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch, { separatePosition }: SeparatePositionLoader) => (
                    <Link url={pathname}>
                      {t(KEY.common_edit)} {t(KEY.recruitment_positions_with_separate_recruitment)} -{' '}
                      {separatePosition ? dbT(separatePosition, 'name') : t(KEY.common_unknown)}
                    </Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_show_unprocessed_applicants}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUnprocessedApplicantsPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_show_unprocessed_applicants)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_users_without_interview}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUsersWithoutInterviewGangPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_show_applicants_without_interview)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_users_three_interview_criteria}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUsersWithoutThreeInterviewCriteriaPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_applet_three_interview_title)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_interview_availability}
                element={<RecruitmentInterviewAvailabilityAdminPage />}
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.interview_availability)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_room_overview}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_VIEW_INTERVIEWROOM]}
                    element={<RoomAdminPage />}
                    resolveWithRolePermissions={true}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_applet_room_overview)}</Link>
                  ),
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_room_create}
                element={
                  <PermissionRoute
                    element={<CreateInterviewRoomPage />}
                    requiredPermissions={[PERM.SAMFUNDET_ADD_INTERVIEWROOM]}
                    resolveWithRolePermissions={true}
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_room_edit}
                element={
                  <PermissionRoute
                    element={<CreateInterviewRoomPage />}
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_INTERVIEWROOM]}
                    resolveWithRolePermissions={true}
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_overview}
                element={
                  <PermissionRoute
                    requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENTPOSITION]}
                    element={<RecruitmentGangOverviewPage />}
                    resolveWithRolePermissions={true}
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
                element={
                  <PermissionRoute
                    element={<RecruitmentUsersWithoutInterviewGangPage />}
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    resolveWithRolePermissions={true}
                  />
                }
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
                    requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentOpenToOtherPositionsPage />}
                    resolveWithRolePermissions={true}
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
                  element={
                    <PermissionRoute
                      requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENTPOSITION]}
                      element={<RecruitmentGangAdminPage />}
                      resolveWithRolePermissions={true}
                    />
                  }
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_create}
                  element={
                    <PermissionRoute
                      requiredPermissions={[PERM.SAMFUNDET_ADD_RECRUITMENTPOSITION]}
                      element={<RecruitmentPositionFormAdminPage />}
                      resolveWithRolePermissions={true}
                    />
                  }
                  loader={recruitmentGangLoader}
                  handle={{
                    crumb: ({ pathname }: UIMatch) => (
                      <Link url={pathname}>
                        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.recruitment_position)}`)}
                      </Link>
                    ),
                  }}
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_edit}
                  element={
                    <PermissionRoute
                      requiredPermissions={[PERM.SAMFUNDET_CHANGE_RECRUITMENTPOSITION]}
                      element={<RecruitmentPositionFormAdminPage />}
                      resolveWithRolePermissions={true}
                    />
                  }
                  loader={recruitmentGangPositionLoader}
                  handle={{
                    crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
                  }}
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_all_applications}
                  element={
                    <PermissionRoute
                      element={<RecruitmentGangAllApplicantsAdminPage />}
                      requiredPermissions={[PERM.SAMFUNDET_ADD_RECRUITMENTPOSITION]}
                      resolveWithRolePermissions={true}
                    />
                  }
                  handle={{
                    crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_all_applications)}</Link>,
                  }}
                />
                {/* Position */}
                <Route
                  element={
                    <SiteFeatureGate feature="recruitment">
                      <Outlet />
                    </SiteFeatureGate>
                  }
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
                    element={
                      <PermissionRoute
                        requiredPermissions={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                        element={<RecruitmentPositionOverviewPage />}
                        resolveWithRolePermissions={true}
                      />
                    }
                  />
                </Route>
              </Route>
            </Route>
          </Route>
          {/* Sulten Admin */}
          <Route
            path={ROUTES.frontend.admin_sulten_reservations}
            element={
              <SiteFeatureGate feature="sulten">
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_VIEW_RESERVATION]}
                  element={<SultenReservationAdminPage />}
                  resolveWithRolePermissions={true}
                />
              </SiteFeatureGate>
            }
          />
          {/*
            Info pages
            Custom layout for edit/create
          */}
          <Route
            path={ROUTES.frontend.admin_information}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.information_page)}</Link> }}
            element={
              <SiteFeatureGate feature="information">
                <PermissionRoute
                  requiredPermissions={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]}
                  element={<InformationAdminPage />}
                  resolveWithRolePermissions={true}
                />
              </SiteFeatureGate>
            }
          />
          <Route
            path={ROUTES.frontend.admin_information_create}
            element={
              <PermissionRoute
                requiredPermissions={[PERM.SAMFUNDET_ADD_INFORMATIONPAGE]}
                element={<InformationFormAdminPage />}
                resolveWithRolePermissions={true}
              />
            }
          />
          <Route
            path={ROUTES.frontend.admin_information_edit}
            element={
              <PermissionRoute
                requiredPermissions={[PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE]}
                element={<InformationFormAdminPage />}
                resolveWithRolePermissions={true}
              />
            }
          />
        </Route>
      </Route>
      {/*
            PUBLIC SULTEN ROUTES
      */}
      <Route
        element={
          <SiteFeatureGate feature="sulten">
            <SultenOutlet />
          </SiteFeatureGate>
        }
      >
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

import { Outlet, Route, type UIMatch, createBrowserRouter, createRoutesFromElements } from 'react-router';
import { Link, PermissionRoute, ProtectedRoute, RootErrorBoundary, SamfOutlet, SultenOutlet } from '~/Components';
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
  RecruitmentAllApplicationsAdminPage,
  RecruitmentApplicantAdminPage,
  RecruitmentFormAdminPage,
  RecruitmentGangAdminPage,
  RecruitmentGangAllApplicantsAdminPage,
  RecruitmentGangOverviewPage,
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
            <Route path={ROUTES.frontend.login} element={<LoginPage />} />
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
            element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_GANG]} element={<AdminPage />} />}
          />
          {/* User pages */}
          <Route
            path={ROUTES.frontend.user_change_password}
            element={<UserChangePasswordPage />}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.change_password)}</Link> }}
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
          {/* Events */}
          <Route
            element={<Outlet />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_events}>{t(KEY.common_events)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_events}
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_EVENT]} element={<EventsAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_events_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={<PermissionRoute required={[PERM.SAMFUNDET_ADD_EVENT]} element={<EventCreatorAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_events_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={<PermissionRoute required={[PERM.SAMFUNDET_CHANGE_EVENT]} element={<EventCreatorAdminPage />} />}
            />
          </Route>
          {/*
            Info pages
            NOTE: edit/create uses custom views
          */}
          <Route
            path={ROUTES.frontend.admin_information}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.information_page)}</Link> }}
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]} element={<InformationAdminPage />} />
            }
          />
          {/* Opening hours, TODO ADD OPENING HOURS PERMISSIONS*/}
          <Route
            path={ROUTES.frontend.admin_opening_hours}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_opening_hours)}</Link> }}
            element={<PermissionRoute required={[]} element={<OpeningHoursAdminPage />} />}
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
              element={
                <PermissionRoute required={[PERM.SAMFUNDET_VIEW_CLOSEDPERIOD]} element={<ClosedPeriodAdminPage />} />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute required={[PERM.SAMFUNDET_ADD_CLOSEDPERIOD]} element={<ClosedPeriodFormAdminPage />} />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]}
                  element={<ClosedPeriodFormAdminPage />}
                />
              }
            />
          </Route>
          {/* Images */}
          <Route
            element={<Outlet />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_images}>{t(KEY.admin_images_title)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_images}
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_IMAGE]} element={<ImageAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_images_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={<PermissionRoute required={[PERM.SAMFUNDET_ADD_IMAGE]} element={<ImageFormAdminPage />} />}
            />
          </Route>
          {/* Saksdokumenter */}
          <Route
            element={<Outlet />}
            handle={{
              crumb: () => <Link url={ROUTES.frontend.admin_saksdokumenter}>{t(KEY.admin_saksdokument)}</Link>,
            }}
          >
            <Route
              path={ROUTES.frontend.admin_saksdokumenter}
              element={
                <PermissionRoute required={[PERM.SAMFUNDET_VIEW_SAKSDOKUMENT]} element={<SaksdokumentAdminPage />} />
              }
            />
            <Route
              path={ROUTES.frontend.admin_saksdokumenter_create}
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link>,
              }}
              element={
                <PermissionRoute required={[PERM.SAMFUNDET_ADD_SAKSDOKUMENT]} element={<SaksdokumentFormAdminPage />} />
              }
            />
            <Route
              path={ROUTES.frontend.admin_saksdokumenter_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]}
                  element={<SaksdokumentFormAdminPage />}
                />
              }
            />
          </Route>
          {/* Lyche Menu */}
          <Route
            element={<Outlet />}
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
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_MENU]} element={<SultenMenuAdminPage />} />}
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
                <PermissionRoute required={[PERM.SAMFUNDET_ADD_MENUITEM]} element={<SultenMenuItemFormAdminPage />} />
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
                  required={[PERM.SAMFUNDET_CHANGE_MENUITEM]}
                  element={<SultenMenuItemFormAdminPage />}
                />
              }
            />
          </Route>
          {/* Recruitment */}
          <Route
            element={<Outlet />}
            path={ROUTES.frontend.admin_recruitment}
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_recruitment}>{t(KEY.common_recruitment)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_recruitment}
              element={<PermissionRoute element={<RecruitmentAdminPage />} />}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_all_positions}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                  element={<RecruitmentAllApplicationsAdminPage />}
                />
              }
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_administrate)}</Link>,
              }}
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
                path={ROUTES.frontend.admin_recruitment_overview}
                element={
                  <PermissionRoute required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]} element={<RecruitmentOverviewPage />} />
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
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                    element={<RecruitmentRejectionMailPage />}
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
                      {t(KEY.common_create)} {t(KEY.recruitment_positions_with_separate_recruitment)}
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
                      {t(KEY.common_edit)} {t(KEY.recruitment_positions_with_separate_recruitment)} -{' '}
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
                path={ROUTES.frontend.admin_recruitment_users_three_interview_criteria}
                element={<RecruitmentUsersWithoutThreeInterviewCriteriaPage />}
                loader={recruitmentLoader}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.recruitment_applet_three_interview_title)}</Link>
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
                path="all-positions/:recruitmentId"
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                    element={<RecruitmentAllApplicationsAdminPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_administrate)}</Link>,
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
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_all_applications}
                  element={<RecruitmentGangAllApplicantsAdminPage />}
                  handle={{
                    crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_all_applications)}</Link>,
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
          {/* Sulten Admin */}
          <Route
            path={ROUTES.frontend.admin_sulten_reservations}
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_VIEW_RESERVATION]} element={<SultenReservationAdminPage />} />
            }
          />
          {/*
            Info pages
            Custom layout for edit/create
          */}
          <Route
            path={ROUTES.frontend.admin_information_create}
            element={
              <PermissionRoute required={[PERM.SAMFUNDET_ADD_INFORMATIONPAGE]} element={<InformationFormAdminPage />} />
            }
          />
          <Route
            path={ROUTES.frontend.admin_information_edit}
            element={
              <PermissionRoute
                required={[PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE]}
                element={<InformationFormAdminPage />}
              />
            }
          />
        </Route>
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

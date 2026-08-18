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
  AccountPage,
  CaseDocumentsPage,
  ComponentPage,
  ContributorsPage,
  EventPage,
  EventsPage,
  GangsPage,
  HealthPage,
  HomePage,
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
  SignUpPage,
  VenuePage,
} from '~/Pages';
import {
  AdminLayout,
  CaseDocumentFormAdminPage,
  CaseDocumentsAdminPage,
  ClosedPeriodAdminPage,
  ClosedPeriodFormAdminPage,
  CreateInterviewRoomPage,
  EventCreatorAdminPage,
  EventsAdminPage,
  GangsAdminPage,
  GangsFormAdminPage,
  ImageAdminPage,
  ImageDetailAdminPage,
  InformationAdminPage,
  InformationFormAdminPage,
  InformationHistoryAdminPage,
  MDBConnectFormAdminPage,
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
import { AdminHomePage } from '~/Pages/AdminHomePage';
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
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route path={ROUTES.frontend.venues} element={<SiteFeatureGate feature="venues"><VenuePage /></SiteFeatureGate>}/>
          <Route path={ROUTES.frontend.health} element={<HealthPage />} />
          {import.meta.env.DEV && <Route path={ROUTES.frontend.components} element={<ComponentPage />} />}
          <Route element={<ProtectedRoute authState={false} element={<Outlet />} />}>
            <Route path={ROUTES.frontend.login} element={<LoginPickerPage />} />
            <Route path={SAMF3_LOGIN_URL.login} element={<LoginPage />} />
            <Route handle={{ crumb: () => <Link url={ROUTES.frontend.login}>{t(KEY.common_login)}</Link> }}>
              <Route
                path={ROUTES.frontend.new_login}
                element={<LoginPage />}
                handle={{
                  crumb: ({ pathname }: UIMatch) => (
                    <Link url={pathname}>{t(KEY.loginpicker_page_new_platform_title)}</Link>
                  ),
                }}
              />
            </Route>
            <Route path={ROUTES.frontend.signup} element={<SignUpPage />} />
          </Route>
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route element={ <SiteFeatureGate feature="information"><Outlet /></SiteFeatureGate>}>
            <Route path={ROUTES.frontend.information_page_detail} element={<InformationPage />} />
          </Route>
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route path={ROUTES.frontend.gangs} element={<SiteFeatureGate feature="gangs"><GangsPage /></SiteFeatureGate>} />
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route element={<SiteFeatureGate feature="events"><Outlet /></SiteFeatureGate>}>
            <Route path={ROUTES.frontend.events} element={<EventsPage />} />
            <Route path={ROUTES.frontend.event} element={<EventPage />} />
          </Route>
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route path={ROUTES.frontend.casedocuments} element={<SiteFeatureGate feature="documents"><CaseDocumentsPage /></SiteFeatureGate>} />
          <Route path={ROUTES.frontend.contributors} element={<ContributorsPage />} />
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route path={ROUTES.frontend.membership} element={<SiteFeatureGate feature="membership"><MembershipPage /></SiteFeatureGate>} />
          <Route path={ROUTES.frontend.contact} element={<div />} />
          <Route path={ROUTES.frontend.luka} element={<div />} />
          {/* Recruitment */}
          {/* biome-ignore format: don't format site feature gate wrapper for readability's sake */}
          <Route path={ROUTES.frontend.recruitment} element={<SiteFeatureGate feature="recruitment"><RecruitmentPage /></SiteFeatureGate> }/>
        </Route>
      </Route>
      {/* Specific recruitment */}
      <Route
        element={
          <SiteFeatureGate feature="recruitment">
            <DynamicOrgOutlet />
          </SiteFeatureGate>
        }
        id="publicRecruitment"
        loader={recruitmentLoader}
      >
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
        element={<ProtectedRoute authState={true} element={<AdminLayout />} redirectPath={ROUTES.frontend.new_login} />}
      >
        <Route element={<Outlet />} errorElement={<RootErrorBoundary />}>
          <Route
            path={ROUTES.frontend.admin}
            element={<ProtectedRoute authState={true} element={<AdminHomePage />} />}
          />
          <Route
            path={ROUTES.frontend.account}
            element={<ProtectedRoute authState={true} element={<AccountPage />} />}
            handle={{ crumb: () => <Link url={ROUTES.frontend.account}>{t(KEY.common_account)}</Link> }}
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
                  required={[PERM.SAMFUNDET_CHANGE_GANG]}
                  element={<GangsAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_gangs_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_GANG]}
                  element={<GangsFormAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_gangs_edit}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_GANG]}
                  element={<GangsFormAdminPage />}
                  resolution="roles"
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
              element={<PermissionRoute required={[PERM.SAMFUNDET_VIEW_USER]} element={<UsersAdminPage />} />}
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
                  required={[PERM.SAMFUNDET_CHANGE_ROLE]}
                  element={<RolesAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_roles_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_ROLE]}
                  element={<RoleFormAdminPage />}
                  resolution="roles"
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
                    required={[PERM.SAMFUNDET_CHANGE_ROLE]}
                    element={<RoleAdminPage />}
                    resolution="roles"
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_roles_edit}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_CHANGE_ROLE]}
                    element={<RoleFormAdminPage />}
                    resolution="roles"
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
                  required={[PERM.SAMFUNDET_CHANGE_EVENT]}
                  element={<EventsAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_events_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_EVENT]}
                  element={<EventCreatorAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_events_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_EVENT]}
                  element={<EventCreatorAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_CHANGE_VENUE]}
                  element={<OpeningHoursAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]}
                  element={<ClosedPeriodAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_CLOSEDPERIOD]}
                  element={<ClosedPeriodFormAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_closed_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_CLOSEDPERIOD]}
                  element={<ClosedPeriodFormAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_VIEW_IMAGE]}
                  element={<ImageAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_images_create}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_IMAGE]}
                  element={<ImageDetailAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_images_detail}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_details)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_IMAGE]}
                  element={<ImageDetailAdminPage />}
                  resolution="roles"
                />
              }
            />
          </Route>
          {/* Case documents */}
          <Route
            element={
              <SiteFeatureGate feature="documents">
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_SAKSDOKUMENT]}
                  element={<Outlet />}
                  resolution="roles"
                />
              </SiteFeatureGate>
            }
            handle={{
              crumb: () => <Link url={ROUTES.frontend.admin_casedocuments}>{t(KEY.admin_casedocument)}</Link>,
            }}
          >
            <Route
              path={ROUTES.frontend.admin_casedocuments}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]}
                  element={<CaseDocumentsAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_casedocuments_create}
              handle={{
                crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link>,
              }}
              element={
                <PermissionRoute required={[PERM.SAMFUNDET_ADD_SAKSDOKUMENT]} element={<CaseDocumentFormAdminPage />} />
              }
            />
            <Route
              path={ROUTES.frontend.admin_casedocuments_edit}
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link> }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT]}
                  element={<CaseDocumentFormAdminPage />}
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
                  required={[PERM.SAMFUNDET_CHANGE_MENU]}
                  element={<SultenMenuAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_ADD_MENUITEM]}
                  element={<SultenMenuItemFormAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_CHANGE_MENUITEM]}
                  element={<SultenMenuItemFormAdminPage />}
                  resolution="roles"
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
                  required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_create}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_RECRUITMENT]}
                  element={<RecruitmentFormAdminPage />}
                  resolution="roles"
                />
              }
              handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_create)}</Link> }}
            />
            <Route
              path={ROUTES.frontend.admin_recruitment_applicant}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_RECRUITMENTAPPLICATION]}
                  element={<RecruitmentApplicantAdminPage />}
                  resolution="roles"
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
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENTSTATISTICS]}
                    element={<RecruitmentOverviewPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.recruitment_overview)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_edit}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                    element={<RecruitmentFormAdminPage />}
                  />
                }
                handle={{
                  crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.common_edit)}</Link>,
                }}
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_overview_rejection_email}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentRejectionMailPage />}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_VIEW_INTERVIEW]}
                    resolution="roles"
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
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUnprocessedApplicantsPage />}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUsersWithoutInterviewGangPage />}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentUsersWithoutThreeInterviewCriteriaPage />}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_VIEW_INTERVIEWROOM]}
                    element={<RoomAdminPage />}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_ADD_INTERVIEWROOM]}
                    resolution="roles"
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_room_edit}
                element={
                  <PermissionRoute
                    element={<CreateInterviewRoomPage />}
                    required={[PERM.SAMFUNDET_CHANGE_INTERVIEWROOM]}
                    resolution="roles"
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_overview}
                element={
                  <PermissionRoute
                    required={[PERM.SAMFUNDET_VIEW_RECRUITMENTPOSITION]}
                    element={<RecruitmentGangOverviewPage />}
                    resolution="roles"
                  />
                }
              />
              <Route
                path={ROUTES.frontend.admin_recruitment_gang_users_without_interview}
                element={
                  <PermissionRoute
                    element={<RecruitmentUsersWithoutInterviewGangPage />}
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    resolution="roles"
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
                    required={[PERM.SAMFUNDET_CHANGE_RECRUITMENT, PERM.SAMFUNDET_ADD_RECRUITMENT]}
                    element={<RecruitmentOpenToOtherPositionsPage />}
                    resolution="roles"
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
                      required={[PERM.SAMFUNDET_VIEW_RECRUITMENTPOSITION]}
                      element={<RecruitmentGangAdminPage />}
                      resolution="roles"
                    />
                  }
                />
                <Route
                  path={ROUTES.frontend.admin_recruitment_gang_position_create}
                  element={
                    <PermissionRoute
                      required={[PERM.SAMFUNDET_ADD_RECRUITMENTPOSITION]}
                      element={<RecruitmentPositionFormAdminPage />}
                      resolution="roles"
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
                      required={[PERM.SAMFUNDET_CHANGE_RECRUITMENTPOSITION]}
                      element={<RecruitmentPositionFormAdminPage />}
                      resolution="roles"
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
                      required={[PERM.SAMFUNDET_ADD_RECRUITMENTPOSITION]}
                      resolution="roles"
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
                        required={[PERM.SAMFUNDET_VIEW_RECRUITMENT]}
                        element={<RecruitmentPositionOverviewPage />}
                        resolution="roles"
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
                  required={[PERM.SAMFUNDET_VIEW_RESERVATION]}
                  element={<SultenReservationAdminPage />}
                  resolution="roles"
                />
              </SiteFeatureGate>
            }
          />
          {/*
            Info pages
            Custom layout for edit/create
          */}
          <Route
            element={
              <SiteFeatureGate feature="information">
                <Outlet />
              </SiteFeatureGate>
            }
            handle={{ crumb: () => <Link url={ROUTES.frontend.admin_information}>{t(KEY.information_pages)}</Link> }}
          >
            <Route
              path={ROUTES.frontend.admin_information}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]}
                  element={<InformationAdminPage />}
                  resolution="anywhere"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_information_create}
              handle={{
                crumb: () => <Link url={ROUTES.frontend.admin_information_create}>{t(KEY.common_create)}</Link>,
              }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_ADD_INFORMATIONPAGE]}
                  element={<InformationFormAdminPage />}
                  resolution="roles"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_information_history}
              handle={{
                crumb: ({ params }: UIMatch) => (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_information_history,
                      urlParams: params,
                    })}
                  >{`${t(KEY.admin_information_history_title)} ${params.slugField ?? ''}`}</Link>
                ),
              }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_VIEW_INFORMATIONPAGE]}
                  element={<InformationHistoryAdminPage />}
                  resolution="anywhere"
                />
              }
            />
            <Route
              path={ROUTES.frontend.admin_information_edit}
              handle={{
                crumb: ({ params }: UIMatch) => (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.admin_information_edit,
                      urlParams: params,
                    })}
                  >{`${t(KEY.common_edit)} ${params.slugField ?? ''}`}</Link>
                ),
              }}
              element={
                <PermissionRoute
                  required={[PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE]}
                  element={<InformationFormAdminPage />}
                  resolution="anywhere"
                />
              }
            />
          </Route>
          {/* MDB Connect Form */}
          <Route
            path={ROUTES.frontend.admin_mdb_connect}
            handle={{ crumb: ({ pathname }: UIMatch) => <Link url={pathname}>{t(KEY.adminpage_connect_mdb)}</Link> }}
            element={<MDBConnectFormAdminPage />}
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

# imports
from __future__ import annotations

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from rest_framework import routers

from django.urls import path, include

import samfundet.view.user_views
import samfundet.view.event_views
import samfundet.view.sulten_views
import samfundet.view.general_views

from . import views
from .view import recruitment_views

# End: imports -----------------------------------------------------------------
router = routers.DefaultRouter()
router.register('images', samfundet.view.general_views.ImageView, 'images')
router.register('tags', samfundet.view.general_views.TagView, 'tags')
router.register('events', samfundet.view.event_views.EventView, 'events')
router.register('eventgroups', samfundet.view.event_views.EventGroupView, 'eventgroups')
router.register('venues', samfundet.view.general_views.VenueView, 'venues')
router.register('closed', samfundet.view.general_views.ClosedPeriodView, 'closedperiods')
router.register('gangs', samfundet.view.general_views.GangView, 'gangs')
router.register('gangsorganized', samfundet.view.general_views.GangTypeView, 'gangsorganized')
router.register('information', samfundet.view.general_views.InformationPageView, 'information')
router.register('blog', samfundet.view.general_views.BlogPostView, 'blog')
router.register('user-preference', samfundet.view.user_views.UserPreferenceView, 'user_preference')
router.register('saksdokument', samfundet.view.general_views.SaksdokumentView, 'saksdokument')
router.register('profile', samfundet.view.user_views.ProfileView, 'profile')
router.register('permissions', samfundet.view.user_views.PermissionView, 'permissions')
router.register('menu', samfundet.view.sulten_views.MenuView, 'menu')
router.register('menu-items', samfundet.view.sulten_views.MenuItemView, 'menu_items')
router.register('food-preference', samfundet.view.sulten_views.FoodPreferenceView, 'food_preference')
router.register('food-category', samfundet.view.sulten_views.FoodCategoryView, 'food_category')
router.register('booking', samfundet.view.sulten_views.BookingView, 'booking')
router.register('table', samfundet.view.sulten_views.TableView, 'table')
router.register('textitem', samfundet.view.general_views.TextItemView, 'text_item')
router.register('interview-rooms', views.InterviewRoomView, 'interview_rooms')
router.register('infobox', samfundet.view.general_views.InfoboxView, 'infobox')
router.register('key-value', samfundet.view.general_views.KeyValueView, 'key_value')
router.register('organizations', samfundet.view.general_views.OrganizationView, 'organizations')
router.register('merch', samfundet.view.general_views.MerchView, 'merch')
router.register('role', samfundet.view.general_views.RoleView, 'role')

########## Recruitment ##########
router.register('recruitment', recruitment_views.RecruitmentView, 'recruitment')
router.register('recruitment-for-recruiter', recruitment_views.RecruitmentForRecruiterView, 'recruitment_for_recruiter')
router.register('recruitment-stats', views.RecruitmentStatisticsView, 'recruitment_stats')
router.register('recruitment-separateposition', views.RecruitmentSeparatePositionView, 'recruitment_separateposition')
router.register('recruitment-position', views.RecruitmentPositionView, 'recruitment_position')
router.register('recruitment-position-for-applicant', views.RecruitmentPositionForApplicantView, 'recruitment_position_for_applicant')
router.register('recruitment-applications-for-applicant', views.RecruitmentApplicationForApplicantView, 'recruitment_applications_for_applicant')
router.register('recruitment-applications-for-gang', recruitment_views.RecruitmentApplicationForGangView, 'recruitment_applications_for_gang')
router.register('recruitment-applications-for-position', views.RecruitmentApplicationForRecruitmentPositionView, 'recruitment_applications_for_position')
router.register('interview', views.InterviewView, 'interview')

######## Lyche #########
router.register('create-reservation', samfundet.view.sulten_views.ReservationCreateView, 'create_reservation')

app_name = 'samfundet'

urlpatterns = [
    path('api/', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='samfundet:schema'), name='swagger_ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='samfundet:schema'), name='redoc'),
    path('csrf/', samfundet.view.user_views.CsrfView.as_view(), name='csrf'),
    path('login/', samfundet.view.user_views.LoginView.as_view(), name='login'),
    path('register/', samfundet.view.user_views.RegisterView.as_view(), name='register'),
    path('logout/', samfundet.view.user_views.LogoutView.as_view(), name='logout'),
    path('password/change/', samfundet.view.user_views.ChangePasswordView.as_view(), name='change-password'),
    path('user/', samfundet.view.user_views.UserView.as_view(), name='user'),
    path('groups/', samfundet.view.user_views.AllGroupsView.as_view(), name='groups'),
    path('users/', samfundet.view.user_views.AllUsersView.as_view(), name='users'),
    path('users-search-paginated/', samfundet.view.user_views.PaginatedSearchUsersView.as_view(), name='users_search_paginated'),
    path('impersonate/', samfundet.view.user_views.ImpersonateView.as_view(), name='impersonate'),
    path('events-per-day/', samfundet.view.event_views.EventPerDayView.as_view(), name='eventsperday'),
    path('events-upcomming/', samfundet.view.event_views.EventsUpcomingView.as_view(), name='eventsupcomming'),
    path('isclosed/', samfundet.view.general_views.IsClosedView().as_view(), name='isclosed'),
    path('home/', samfundet.view.general_views.HomePageView().as_view(), name='home'),
    path('assign_group/', samfundet.view.user_views.AssignGroupView.as_view(), name='assign_group'),
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
    path('gangtypes/<int:organization>/', samfundet.view.general_views.GangTypeOrganizationView.as_view(), name='gangsorganized'),
    ########## Lyche ##########
    path('check-reservation/', samfundet.view.sulten_views.ReservationCheckAvailabilityView.as_view(), name='check_reservation'),
    ########## Recruitment ##########
    path('active-recruitments/', views.ActiveRecruitmentsView.as_view(), name='active_recruitments'),
    path('recruitment-positions/', views.RecruitmentPositionsPerRecruitmentView.as_view(), name='recruitment_positions'),
    path(
        'recruitment-show-unprocessed-applicants/',
        views.RecruitmentUnprocessedApplicationsPerRecruitment.as_view(),
        name='recruitment_show_unprocessed_applicants',
    ),
    path(
        'recruitment-positions-gang-for-applicant/',
        views.RecruitmentPositionsPerGangForApplicantView.as_view(),
        name='recruitment_positions_gang_for_applicants',
    ),
    path(
        'recruitment-shared-interview-groups/<int:recruitment_id>/',
        views.RecruitmentInterviewGroupView.as_view(),
        name='recruitment_shared_interviews',
    ),
    path('recruitment-positions-gang-for-gangs/', views.RecruitmentPositionsPerGangForGangView.as_view(), name='recruitment_positions_gang_for_gangs'),
    path('recruitment-set-interview/<slug:pk>/', views.RecruitmentApplicationSetInterviewView.as_view(), name='recruitment_set_interview'),
    path(
        'recruitment-application-states-choices',
        views.RecruitmentApplicationStateChoicesView.as_view(),
        name='recruitment_application_states_choices',
    ),
    path(
        'recruitment-application-update-state-gang/<slug:pk>/',
        views.RecruitmentApplicationForGangUpdateStateView.as_view(),
        name='recruitment_application_update_state_gang',
    ),
    path(
        'recruitment-position-organized-applications/<int:pk>/',
        views.RecruitmentPositionOrganizedApplicationsView.as_view(),
        name='recruitment_position_organized_applications',
    ),
    path(
        'recruitment-application-update-state-position/<slug:pk>/',
        views.RecruitmentApplicationForPositionUpdateStateView.as_view(),
        name='recruitment_application_update_state_position',
    ),
    path(
        'recruitment-application-recruiter/<str:application_id>/',
        views.RecruitmentApplicationForRecruitersView.as_view(),
        name='recruitment_applications_recruiter',
    ),
    path(
        'recruitment-application-interview-notes/<int:interview_id>/',
        views.RecruitmentApplicationInterviewNotesView.as_view(),
        name='recruitment_application_interview_notes',
    ),
    path('recruitment-withdraw-application/<int:pk>/', views.RecruitmentApplicationWithdrawApplicantView.as_view(), name='recruitment_withdraw_application'),
    path('recruitment-user-priority-update/<slug:pk>/', views.RecruitmentApplicationApplicantPriorityView.as_view(), name='recruitment_user_priority_update'),
    path(
        'recruitment-withdraw-application-recruiter/<slug:pk>/',
        views.RecruitmentApplicationWithdrawRecruiterView.as_view(),
        name='recruitment_withdraw_application_recruiter',
    ),
    path('active-recruitment-positions/', views.ActiveRecruitmentPositionsView.as_view(), name='active_recruitment_positions'),
    path('rejected-applicants/', views.SendRejectionMailView.as_view(), name='rejected_applicants/'),
    path('recruitment-applicants-without-interviews/<int:pk>/', views.ApplicantsWithoutInterviewsView.as_view(), name='applicants_without_interviews'),
    path(
        'recruitment-applicants-without-three-interview-criteria/<int:pk>/',
        views.ApplicantsWithoutThreeInterviewsCriteriaView.as_view(),
        name='applicants_without_three_interview_criteria',
    ),
    path(
        'recruitment-recruiter-dashboard/<int:pk>/',
        views.RecruitmentRecruiterDashboardView.as_view(),
        name='recruitment_recruiter_dashboard',
    ),
    path(
        'recruitment-download-all-applications-csv/<int:recruitment_id>/',
        views.DownloadAllRecruitmentApplicationCSV.as_view(),
        name='recruitment_download_applications_csv',
    ),
    path(
        'recruitment-download-gang-application-csv/<int:recruitment_id>/<int:gang_id>',
        views.DownloadRecruitmentApplicationGangCSV.as_view(),
        name='recruitment_download_gang_application_csv',
    ),
    path('occupiedtimeslot/', views.OccupiedTimeslotView.as_view(), name='occupied_timeslots'),
    path(
        'recruitment/<int:recruitment_id>/interviewer-availability/', views.InterviewerAvailabilityForDate.as_view(), name='interviewer-availability-for-date'
    ),
    path('recruitment-interview-availability/', views.RecruitmentInterviewAvailabilityView.as_view(), name='recruitment_interview_availability'),
    path('recruitment/<int:id>/availability/', views.RecruitmentAvailabilityView.as_view(), name='recruitment_availability'),
    path('feedback/', samfundet.view.general_views.UserFeedbackView.as_view(), name='feedback'),
    path('purchase-feedback/', samfundet.view.event_views.PurchaseFeedbackView.as_view(), name='purchase_feedback'),
    path('recruitment/<int:recruitment_id>/gang/<int:gang_id>/stats/', views.GangApplicationCountView.as_view(), name='gang-application-stats'),
    path('recruitment/<int:id>/positions-by-tags/', views.PositionByTagsView.as_view(), name='recruitment_positions_by_tags'),
    path('recruitment/all-applications/', views.RecruitmentAllApplicationsPerRecruitmentView.as_view(), name='recruitment-all-applications'),
]

# imports
from __future__ import annotations

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from rest_framework import routers

from django.urls import path, include

from . import views

# End: imports -----------------------------------------------------------------
router = routers.DefaultRouter()
router.register('images', views.ImageView, 'images')
router.register('tags', views.TagView, 'tags')
router.register('events', views.EventView, 'events')
router.register('eventgroups', views.EventGroupView, 'eventgroups')
router.register('venues', views.VenueView, 'venues')
router.register('closed', views.ClosedPeriodView, 'closedperiods')
router.register('gangs', views.GangView, 'gangs')
router.register('gangsorganized', views.GangTypeView, 'gangsorganized')
router.register('information', views.InformationPageView, 'information')
router.register('blog', views.BlogPostView, 'blog')
router.register('user-preference', views.UserPreferenceView, 'user_preference')
router.register('saksdokument', views.SaksdokumentView, 'saksdokument')
router.register('profile', views.ProfileView, 'profile')
router.register('menu', views.MenuView, 'menu')
router.register('menu-items', views.MenuItemView, 'menu_items')
router.register('food-preference', views.FoodPreferenceView, 'food_preference')
router.register('food-category', views.FoodCategoryView, 'food_category')
router.register('booking', views.BookingView, 'booking')
router.register('table', views.TableView, 'table')
router.register('textitem', views.TextItemView, 'text_item')
router.register('interview-rooms', views.InterviewRoomView, 'interview_rooms')
router.register('infobox', views.InfoboxView, 'infobox')
router.register('key-value', views.KeyValueView, 'key_value')
router.register('organizations', views.OrganizationView, 'organizations')
router.register('merch', views.MerchView, 'merch')

########## Recruitment ##########
router.register('recruitment', views.RecruitmentView, 'recruitment')
router.register('recruitment-for-recruiter', views.RecruitmentForRecruiterView, 'recruitment_for_recruiter')
router.register('recruitment-stats', views.RecruitmentStatisticsView, 'recruitment_stats')
router.register('recruitment-position', views.RecruitmentPositionView, 'recruitment_position')
router.register('recruitment-position-for-applicant', views.RecruitmentPositionForApplicantView, 'recruitment_position_for_applicant')
router.register('recruitment-applications-for-applicant', views.RecruitmentApplicationForApplicantView, 'recruitment_applications_for_applicant')
router.register('recruitment-applications-for-group', views.RecruitmentApplicationForGangView, 'recruitment_applications_for_group')
router.register('recruitment-applications-for-gang', views.RecruitmentApplicationForGangView, 'recruitment_applications_for_gang')
router.register('recruitment-applications-for-position', views.RecruitmentApplicationForRecruitmentPositionView, 'recruitment_applications_for_position')
router.register('interview', views.InterviewView, 'interview')
router.register('interview-timeblocks', views.InterviewTimeblockView, 'interview_timeblock')

app_name = 'samfundet'

urlpatterns = [
    path('api/', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='samfundet:schema'), name='swagger_ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='samfundet:schema'), name='redoc'),
    path('csrf/', views.CsrfView.as_view(), name='csrf'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('groups/', views.AllGroupsView.as_view(), name='groups'),
    path('users/', views.AllUsersView.as_view(), name='users'),
    path('impersonate/', views.ImpersonateView.as_view(), name='impersonate'),
    path('events-per-day/', views.EventPerDayView.as_view(), name='eventsperday'),
    path('events-upcomming/', views.EventsUpcomingView.as_view(), name='eventsupcomming'),
    path('isclosed/', views.IsClosedView().as_view(), name='isclosed'),
    path('home/', views.HomePageView().as_view(), name='home'),
    path('assign_group/', views.AssignGroupView.as_view(), name='assign_group'),
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
    ########## Lyche ##########
    path('check-reservation/', views.ReservationCheckAvailabilityView.as_view(), name='check_reservation'),
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
        'recruitment-application-update-state-position/<slug:pk>/',
        views.RecruitmentApplicationForPositionUpdateStateView.as_view(),
        name='recruitment_application_update_state_position',
    ),
    path(
        'recruitment-application-recruiter/<str:application_id>/',
        views.RecruitmentApplicationForRecruitersView.as_view(),
        name='recruitment_applications_recruiter',
    ),
    path('recruitment-withdraw-application/<int:pk>/', views.RecruitmentApplicationWithdrawApplicantView.as_view(), name='recruitment_withdraw_application'),
    path('recruitment-user-priority-update/<slug:pk>/', views.RecruitmentApplicationApplicantPriorityView.as_view(), name='recruitment_user_priority_update'),
    path(
        'recruitment-withdraw-application-recruiter/<slug:pk>/',
        views.RecruitmentApplicationWithdrawRecruiterView.as_view(),
        name='recruitment_withdraw_application_recruiter',
    ),
    path('active-recruitment-positions/', views.ActiveRecruitmentPositionsView.as_view(), name='active_recruitment_positions'),
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
        'recruitment-download-gang-application-csv/<int:recruitment_id>/<int:gang_id>',
        views.DownloadRecruitmentApplicationGangCSV.as_view(),
        name='recruitment_download_gang_application_csv',
    ),
    path('occupiedtimeslot/', views.OccupiedTimeslotView.as_view(), name='occupied_timeslots'),
    path('recruitment-interview-availability/', views.RecruitmentInterviewAvailabilityView.as_view(), name='recruitment_interview_availability'),
    path('recruitment/<int:id>/availability/', views.RecruitmentAvailabilityView.as_view(), name='recruitment_availability'),
    path('feedback/', views.UserFeedbackView.as_view(), name='feedback'),
    path('generate-interview-blocks/<int:pk>', views.GenerateInterviewTimeblocksView.as_view(), name='generate_interview_blocks'),
    path('purchase-feedback/', views.PurchaseFeedbackView.as_view(), name='purchase_feedback'),
]

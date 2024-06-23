# imports
from __future__ import annotations

from rest_framework import routers

from django.urls import path, include

from . import views

# End: imports -----------------------------------------------------------------

router = routers.DefaultRouter()
router.register('gangs', views.GangView, 'gangs')
router.register('gangsorganized', views.GangTypeView, 'gangsorganized')
router.register('user-preference', views.UserPreferenceView, 'user_preference')
router.register('profile', views.ProfileView, 'profile')
router.register('textitem', views.TextItemView, 'text_item')
router.register('interview-rooms', views.InterviewRoomView, 'interview_rooms')
router.register('infobox', views.InfoboxView, 'infobox')
router.register('key-value', views.KeyValueView, 'key_value')
router.register('organizations', views.OrganizationView, 'organizations')

########## Recruitment ##########
router.register('recruitment', views.RecruitmentView, 'recruitment')
router.register('recruitment-stats', views.RecruitmentStatisticsView, 'recruitment_stats')
router.register('recruitment-position', views.RecruitmentPositionView, 'recruitment_position')
router.register('recruitment-admisisons-for-applicant', views.RecruitmentAdmissionForApplicantView, 'recruitment_admissions_for_applicant')
router.register('recruitment-admisisons-for-group', views.RecruitmentAdmissionForGangView, 'recruitment_admissions_for_group')
router.register('recruitment-admisisons-for-gang', views.RecruitmentAdmissionForGangView, 'recruitment_admissions_for_gang')
router.register('recruitment-admissions-for-applicant', views.RecruitmentAdmissionForApplicantView, 'recruitment_admissions_for_applicant')
router.register('recruitment-admissions-for-position', views.RecruitmentAdmissionForRecruitmentPositionView, 'recruitment_admissions_for_position')
router.register('recruitment-admissions-for-gang', views.RecruitmentAdmissionForGangView, 'recruitment_admissions_for_gang')
router.register('interview', views.InterviewView, 'interview')

app_name = 'samfundet'

urlpatterns = [
    path('api/', include(router.urls)),
    path('csrf/', views.CsrfView.as_view(), name='csrf'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('groups/', views.AllGroupsView.as_view(), name='groups'),
    path('users/', views.AllUsersView.as_view(), name='users'),
    path('impersonate/', views.ImpersonateView.as_view(), name='impersonate'),
    path('assign_group/', views.AssignGroupView.as_view(), name='assign_group'),
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
    ########## Recruitment ##########
    path('active-recruitments/', views.ActiveRecruitmentsView.as_view(), name='active_recruitments'),
    path('recruitment-positions/', views.RecruitmentPositionsPerRecruitmentView.as_view(), name='recruitment_positions'),
    path('recruitment-positions-gang/', views.RecruitmentPositionsPerGangView.as_view(), name='recruitment_positions_gang'),
    path(
        'recruitment-admission-states-choices',
        views.RecruitmentAdmissionStateChoicesView.as_view(),
        name='recruitment_admission_states_choices',
    ),
    path(
        'recruitment-admission-update-state-gang/<slug:pk>/',
        views.RecruitmentAdmissionForGangUpdateStateView.as_view(),
        name='recruitment_admission_update_state_gang',
    ),
    path(
        'recruitment-admission-update-state-position/<slug:pk>/',
        views.RecruitmentAdmissionForPositionUpdateStateView.as_view(),
        name='recruitment_admission_update_state_position',
    ),
    path(
        'recruitment-admissions-recruiter/<str:admission_id>/', views.RecruitmentAdmissionForRecruitersView.as_view(), name='recruitment_admissions_recruiter'
    ),
    path('recruitment-withdraw-admission/<int:pk>/', views.RecruitmentAdmissionWithdrawApplicantView.as_view(), name='recruitment_withdraw_admission'),
    path('recruitment-user-priority-update/<slug:pk>/', views.RecruitmentAdmissionApplicantPriorityView.as_view(), name='recruitment_user_priority_update'),
    path('active-recruitment-positions/', views.ActiveRecruitmentPositionsView.as_view(), name='active_recruitment_positions'),
    path('applicants-without-interviews/', views.ApplicantsWithoutInterviewsView.as_view(), name='applicants_without_interviews/'),
    path(
        'recruitment-download-gang-admission-csv/<int:recruitment_id>/<int:gang_id>',
        views.DownloadRecruitmentAdmissionGangCSV.as_view(),
        name='recruitment_download_gang_admission_csv',
    ),
    path('occupiedtimeslot/', views.OccupiedTimeslotView.as_view(), name='occupied_timeslots'),
    path('recruitment-interview-availability/', views.RecruitmentInterviewAvailabilityView.as_view(), name='recruitment_interview_availability'),
    path('recruitment/<int:id>/availability/', views.RecruitmentAvailabilityView.as_view(), name='recruitment_availability'),
]

# API Documentation

*==auto-generated== by "generateApiDocs.mjs" on 2024-09-12*.

Generate new documentation by going to *Samfundet4/frontend/src* in the terminal and running 

`node generateApiDocs.mjs` 

If API methods have JSDocs associated with them, it will be documented in the description.

Server must of course be running to access local endpoints. Clicking some link should take you to the DRF user-interface. 

## `getCsrfToken`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/csrf/`](http://localhost:8000/csrf/)
- **Route Key**: `samfundet__csrf`
#### **Description**: 

 Used to fetch a CSRF token. @returns response containing CSRF token / 

## `login`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/login/`](http://localhost:8000/login/)
- **Route Key**: `samfundet__login`
#### **Description**: 

 No description provided.

## `logout`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/logout/`](http://localhost:8000/logout/)
- **Route Key**: `samfundet__logout`
#### **Description**: 

 No description provided.

## `register`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/register/`](http://localhost:8000/register/)
- **Route Key**: `samfundet__register`
#### **Description**: 

 No description provided.

## `getUser`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/user/`](http://localhost:8000/user/)
- **Route Key**: `samfundet__user`
#### **Description**: 

 No description provided.

## `impersonateUser`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/impersonate/`](http://localhost:8000/impersonate/)
- **Route Key**: `samfundet__impersonate`
#### **Description**: 

 No description provided.

## `getUsers`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/users/`](http://localhost:8000/users/)
- **Route Key**: `samfundet__users`
#### **Description**: 

 No description provided.

## `assignUserToGroup`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/assign_group/`](http://localhost:8000/assign_group/)
- **Route Key**: `samfundet__assign_group`
#### **Description**: 

 No description provided.

## `getHomeData`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/home/`](http://localhost:8000/home/)
- **Route Key**: `samfundet__home`
#### **Description**: 

 No description provided.

## `putUserPreference`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/user-preference/:pk/`](http://localhost:8000/api/user-preference/:pk/)
- **Route Key**: `samfundet__user_preference_detail`
#### **Description**: 

 No description provided.

## `getVenues`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/venues/`](http://localhost:8000/api/venues/)
- **Route Key**: `samfundet__venues_list`
#### **Description**: 

 No description provided.

## `getVenue`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/venues/:slug/`](http://localhost:8000/api/venues/:slug/)
- **Route Key**: `samfundet__venues_detail`
#### **Description**: 

 No description provided.

## `putVenue`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/venues/:slug/`](http://localhost:8000/api/venues/:slug/)
- **Route Key**: `samfundet__venues_detail`
#### **Description**: 

 No description provided.

## `getInformationPages`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/information/`](http://localhost:8000/api/information/)
- **Route Key**: `samfundet__information_list`
#### **Description**: 

 No description provided.

## `getInformationPage`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/information/:pk/`](http://localhost:8000/api/information/:pk/)
- **Route Key**: `samfundet__information_detail`
#### **Description**: 

 No description provided.

## `deleteInformationPage`
- **Method**: `DELETE`
- **Endpoint**: [`http://localhost:8000/api/information/:pk/`](http://localhost:8000/api/information/:pk/)
- **Route Key**: `samfundet__information_detail`
#### **Description**: 

 No description provided.

## `postInformationPage`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/information/`](http://localhost:8000/api/information/)
- **Route Key**: `samfundet__information_list`
#### **Description**: 

 No description provided.

## `putInformationPage`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/information/:pk/`](http://localhost:8000/api/information/:pk/)
- **Route Key**: `samfundet__information_detail`
#### **Description**: 

 No description provided.

## `getEventsPerDay`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/events-per-day/`](http://localhost:8000/events-per-day/)
- **Route Key**: `samfundet__eventsperday`
#### **Description**: 

 No description provided.

## `getEventsUpcomming`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/events-upcomming/`](http://localhost:8000/events-upcomming/)
- **Route Key**: `samfundet__eventsupcomming`
#### **Description**: 

 No description provided.

## `getEvents`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/events/`](http://localhost:8000/api/events/)
- **Route Key**: `samfundet__events_list`
#### **Description**: 

 No description provided.

## `postEvent`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/events/`](http://localhost:8000/api/events/)
- **Route Key**: `samfundet__events_list`
#### **Description**: 

 No description provided.

## `putEvent`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/events/:pk/`](http://localhost:8000/api/events/:pk/)
- **Route Key**: `samfundet__events_detail`
#### **Description**: 

 No description provided.

## `deleteEvent`
- **Method**: `DELETE`
- **Endpoint**: [`http://localhost:8000/api/events/:pk/`](http://localhost:8000/api/events/:pk/)
- **Route Key**: `samfundet__events_detail`
#### **Description**: 

 No description provided.

## `getEvent`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/events/:pk/`](http://localhost:8000/api/events/:pk/)
- **Route Key**: `samfundet__events_detail`
#### **Description**: 

 No description provided.

## `getEventGroups`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/eventgroups/`](http://localhost:8000/api/eventgroups/)
- **Route Key**: `samfundet__eventgroups_list`
#### **Description**: 

 No description provided.

## `getMenus`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/menu/`](http://localhost:8000/api/menu/)
- **Route Key**: `samfundet__menu_list`
#### **Description**: 

 No description provided.

## `getMenu`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/menu/:pk/`](http://localhost:8000/api/menu/:pk/)
- **Route Key**: `samfundet__menu_detail`
#### **Description**: 

 No description provided.

## `getMenuItems`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/menu-items/`](http://localhost:8000/api/menu-items/)
- **Route Key**: `samfundet__menu_items_list`
#### **Description**: 

 No description provided.

## `getMenuItem`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/menu-items/:pk/`](http://localhost:8000/api/menu-items/:pk/)
- **Route Key**: `samfundet__menu_items_detail`
#### **Description**: 

 No description provided.

## `putMenuItem`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/menu-items/:pk/`](http://localhost:8000/api/menu-items/:pk/)
- **Route Key**: `samfundet__menu_items_detail`
#### **Description**: 

 No description provided.

## `postMenuItem`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/menu-items/`](http://localhost:8000/api/menu-items/)
- **Route Key**: `samfundet__menu_items_list`
#### **Description**: 

 No description provided.

## `getFoodPreferences`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/food-preference/`](http://localhost:8000/api/food-preference/)
- **Route Key**: `samfundet__food_preference_list`
#### **Description**: 

 No description provided.

## `getFoodPreference`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/food-preference/:pk/`](http://localhost:8000/api/food-preference/:pk/)
- **Route Key**: `samfundet__food_preference_detail`
#### **Description**: 

 No description provided.

## `getFoodCategories`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/food-category/`](http://localhost:8000/api/food-category/)
- **Route Key**: `samfundet__food_category_list`
#### **Description**: 

 No description provided.

## `getFoodCategory`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/food-category/:pk/`](http://localhost:8000/api/food-category/:pk/)
- **Route Key**: `samfundet__food_category_detail`
#### **Description**: 

 No description provided.

## `getTextItem`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/textitem/:pk/`](http://localhost:8000/api/textitem/:pk/)
- **Route Key**: `samfundet__text_item_detail`
#### **Description**: 

 No description provided.

## `getSaksdokumenter`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/saksdokument/`](http://localhost:8000/api/saksdokument/)
- **Route Key**: `samfundet__saksdokument_list`
#### **Description**: 

 No description provided.

## `getSaksdokument`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/saksdokument/:pk/`](http://localhost:8000/api/saksdokument/:pk/)
- **Route Key**: `samfundet__saksdokument_detail`
#### **Description**: 

 No description provided.

## `postSaksdokument`
- **Method**: `POSTFORM`
- **Endpoint**: [`http://localhost:8000/api/saksdokument/`](http://localhost:8000/api/saksdokument/)
- **Route Key**: `samfundet__saksdokument_list`
#### **Description**: 

 No description provided.

## `putSaksdokument`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/saksdokument/:pk/`](http://localhost:8000/api/saksdokument/:pk/)
- **Route Key**: `samfundet__saksdokument_detail`
#### **Description**: 

 No description provided.

## `getOrganizations`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/organizations/`](http://localhost:8000/api/organizations/)
- **Route Key**: `samfundet__organizations_list`
#### **Description**: 

 No description provided.

## `getOrganization`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/organizations/:pk/`](http://localhost:8000/api/organizations/:pk/)
- **Route Key**: `samfundet__organizations_detail`
#### **Description**: 

 No description provided.

## `getGangList`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/gangsorganized/`](http://localhost:8000/api/gangsorganized/)
- **Route Key**: `samfundet__gangsorganized_list`
#### **Description**: 

 No description provided.

## `getGang`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/gangs/:pk/`](http://localhost:8000/api/gangs/:pk/)
- **Route Key**: `samfundet__gangs_detail`
#### **Description**: 

 No description provided.

## `getRecruitmentGangs`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment/:pk/gangs/`](http://localhost:8000/api/recruitment/:pk/gangs/)
- **Route Key**: `samfundet__recruitment_gangs`
#### **Description**: 

 No description provided.

## `getGangsByOrganization`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/organizations/:pk/gangs/`](http://localhost:8000/api/organizations/:pk/gangs/)
- **Route Key**: `samfundet__organizations_gangs`
#### **Description**: 

 No description provided.

## `getGangs`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/gangs/`](http://localhost:8000/api/gangs/)
- **Route Key**: `samfundet__gangs_list`
#### **Description**: 

 No description provided.

## `postGang`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/gangs/`](http://localhost:8000/api/gangs/)
- **Route Key**: `samfundet__gangs_list`
#### **Description**: 

 No description provided.

## `putGang`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/gangs/:pk/`](http://localhost:8000/api/gangs/:pk/)
- **Route Key**: `samfundet__gangs_detail`
#### **Description**: 

 No description provided.

## `getClosedPeriods`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/closed/`](http://localhost:8000/api/closed/)
- **Route Key**: `samfundet__closedperiods_list`
#### **Description**: 

 No description provided.

## `getClosedPeriod`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/closed/:pk/`](http://localhost:8000/api/closed/:pk/)
- **Route Key**: `samfundet__closedperiods_detail`
#### **Description**: 

 No description provided.

## `putClosedPeriod`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/closed/:pk/`](http://localhost:8000/api/closed/:pk/)
- **Route Key**: `samfundet__closedperiods_detail`
#### **Description**: 

 No description provided.

## `postClosedPeriod`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/closed/`](http://localhost:8000/api/closed/)
- **Route Key**: `samfundet__closedperiods_list`
#### **Description**: 

 No description provided.

## `deleteClosedPeriod`
- **Method**: `DELETE`
- **Endpoint**: [`http://localhost:8000/api/closed/:pk/`](http://localhost:8000/api/closed/:pk/)
- **Route Key**: `samfundet__closedperiods_detail`
#### **Description**: 

 No description provided.

## `getImages`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/images/`](http://localhost:8000/api/images/)
- **Route Key**: `samfundet__images_list`
#### **Description**: 

 No description provided.

## `getImage`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/images/:pk/`](http://localhost:8000/api/images/:pk/)
- **Route Key**: `samfundet__images_detail`
#### **Description**: 

 No description provided.

## `postImage`
- **Method**: `POSTFORM`
- **Endpoint**: [`http://localhost:8000/api/images/`](http://localhost:8000/api/images/)
- **Route Key**: `samfundet__images_list`
#### **Description**: 

 No description provided.

## `putImage`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/images/:pk/`](http://localhost:8000/api/images/:pk/)
- **Route Key**: `samfundet__images_detail`
#### **Description**: 

 No description provided.

## `getAllRecruitments`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment/`](http://localhost:8000/api/recruitment/)
- **Route Key**: `samfundet__recruitment_list`
#### **Description**: 

 No description provided.

## `getRecruitment`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment/:pk/`](http://localhost:8000/api/recruitment/:pk/)
- **Route Key**: `samfundet__recruitment_detail`
#### **Description**: 

 No description provided.

## `postRecruitment`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/recruitment/`](http://localhost:8000/api/recruitment/)
- **Route Key**: `samfundet__recruitment_list`
#### **Description**: 

 No description provided.

## `putRecruitment`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/recruitment/:pk/`](http://localhost:8000/api/recruitment/:pk/)
- **Route Key**: `samfundet__recruitment_detail`
#### **Description**: 

 No description provided.

## `getRecruitmentPositions`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-positions/`](http://localhost:8000/recruitment-positions/)
- **Route Key**: `samfundet__recruitment_positions`
#### **Description**: 

 No description provided.

## `getRecruitmentPositionsGangForApplicant`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-positions-gang-for-applicant/`](http://localhost:8000/recruitment-positions-gang-for-applicant/)
- **Route Key**: `samfundet__recruitment_positions_gang_for_applicants`
#### **Description**: 

 No description provided.

## `getRecruitmentPositionsGangForGang`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-positions-gang-for-gangs/`](http://localhost:8000/recruitment-positions-gang-for-gangs/)
- **Route Key**: `samfundet__recruitment_positions_gang_for_gangs`
#### **Description**: 

 No description provided.

## `getRecruitmentAvailability`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment/:id/availability/`](http://localhost:8000/recruitment/:id/availability/)
- **Route Key**: `samfundet__recruitment_availability`
#### **Description**: 

 No description provided.

## `getOccupiedTimeslots`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/occupiedtimeslot/`](http://localhost:8000/occupiedtimeslot/)
- **Route Key**: `samfundet__occupied_timeslots`
#### **Description**: 

 No description provided.

## `postOccupiedTimeslots`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/occupiedtimeslot/`](http://localhost:8000/occupiedtimeslot/)
- **Route Key**: `samfundet__occupied_timeslots`
#### **Description**: 

 No description provided.

## `getRecruitmentPositionForApplicant`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-position-for-applicant/:pk/`](http://localhost:8000/api/recruitment-position-for-applicant/:pk/)
- **Route Key**: `samfundet__recruitment_position_for_applicant_detail`
#### **Description**: 

 No description provided.

## `getRecruitmentPosition`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-position/:pk/`](http://localhost:8000/api/recruitment-position/:pk/)
- **Route Key**: `samfundet__recruitment_position_detail`
#### **Description**: 

 No description provided.

## `postRecruitmentPosition`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/api/recruitment-position/`](http://localhost:8000/api/recruitment-position/)
- **Route Key**: `samfundet__recruitment_position_list`
#### **Description**: 

 No description provided.

## `putRecruitmentPosition`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/recruitment-position/:pk/`](http://localhost:8000/api/recruitment-position/:pk/)
- **Route Key**: `samfundet__recruitment_position_detail`
#### **Description**: 

 No description provided.

## `setRecruitmentApplicationInterview`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-set-interview/:pk/`](http://localhost:8000/recruitment-set-interview/:pk/)
- **Route Key**: `samfundet__recruitment_set_interview`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationsForApplicant`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-applicant/`](http://localhost:8000/api/recruitment-applications-for-applicant/)
- **Route Key**: `samfundet__recruitment_applications_for_applicant_list`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationsForRecruiter`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-application-recruiter/:applicationId/`](http://localhost:8000/recruitment-application-recruiter/:applicationId/)
- **Route Key**: `samfundet__recruitment_applications_recruiter`
#### **Description**: 

 No description provided.

## `putRecruitmentPriorityForUser`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-user-priority-update/:pk/`](http://localhost:8000/recruitment-user-priority-update/:pk/)
- **Route Key**: `samfundet__recruitment_user_priority_update`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicantForApplicant`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-applicant/:pk/`](http://localhost:8000/api/recruitment-applications-for-applicant/:pk/)
- **Route Key**: `samfundet__recruitment_applications_for_applicant_detail`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationsForGang`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-gang/`](http://localhost:8000/api/recruitment-applications-for-gang/)
- **Route Key**: `samfundet__recruitment_applications_for_gang_list`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationsForRecruitmentPosition`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-gang/:pk/`](http://localhost:8000/api/recruitment-applications-for-gang/:pk/)
- **Route Key**: `samfundet__recruitment_applications_for_gang_detail`
#### **Description**: 

 No description provided.

## `putRecruitmentApplicationForGang`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-gang/:pk/`](http://localhost:8000/api/recruitment-applications-for-gang/:pk/)
- **Route Key**: `samfundet__recruitment_applications_for_gang_detail`
#### **Description**: 

 No description provided.

## `updateRecruitmentApplicationStateForGang`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-application-update-state-gang/:pk/`](http://localhost:8000/recruitment-application-update-state-gang/:pk/)
- **Route Key**: `samfundet__recruitment_application_update_state_gang`
#### **Description**: 

 No description provided.

## `updateRecruitmentApplicationStateForPosition`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-application-update-state-position/:pk/`](http://localhost:8000/recruitment-application-update-state-position/:pk/)
- **Route Key**: `samfundet__recruitment_application_update_state_position`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationStateChoices`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-application-states-choices`](http://localhost:8000/recruitment-application-states-choices)
- **Route Key**: `samfundet__recruitment_application_states_choices`
#### **Description**: 

 No description provided.

## `getActiveRecruitmentPositions`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/active-recruitment-positions/`](http://localhost:8000/active-recruitment-positions/)
- **Route Key**: `samfundet__active_recruitment_positions`
#### **Description**: 

 No description provided.

## `getActiveRecruitments`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/active-recruitments/`](http://localhost:8000/active-recruitments/)
- **Route Key**: `samfundet__active_recruitments`
#### **Description**: 

 No description provided.

## `getApplicantsWithoutInterviews`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-applicants-without-interviews/:pk/`](http://localhost:8000/recruitment-applicants-without-interviews/:pk/)
- **Route Key**: `samfundet__applicants_without_interviews`
#### **Description**: 

 No description provided.

## `getApplicantsWithoutThreeInterviewCriteria`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/recruitment-applicants-without-three-interview-criteria/:pk/`](http://localhost:8000/recruitment-applicants-without-three-interview-criteria/:pk/)
- **Route Key**: `samfundet__applicants_without_three_interview_criteria`
#### **Description**: 

 No description provided.

## `putRecruitmentApplication`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-applicant/:pk/`](http://localhost:8000/api/recruitment-applications-for-applicant/:pk/)
- **Route Key**: `samfundet__recruitment_applications_for_applicant_detail`
#### **Description**: 

 No description provided.

## `getRecruitmentApplicationForPosition`
- **Method**: `GET`
- **Endpoint**: [`http://localhost:8000/api/recruitment-applications-for-applicant/:pk/`](http://localhost:8000/api/recruitment-applications-for-applicant/:pk/)
- **Route Key**: `samfundet__recruitment_applications_for_applicant_detail`
#### **Description**: 

 No description provided.

## `withdrawRecruitmentApplicationApplicant`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-withdraw-application/:pk/`](http://localhost:8000/recruitment-withdraw-application/:pk/)
- **Route Key**: `samfundet__recruitment_withdraw_application`
#### **Description**: 

 No description provided.

## `withdrawRecruitmentApplicationRecruiter`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/recruitment-withdraw-application-recruiter/:pk/`](http://localhost:8000/recruitment-withdraw-application-recruiter/:pk/)
- **Route Key**: `samfundet__recruitment_withdraw_application_recruiter`
#### **Description**: 

 No description provided.

## `putRecruitmentApplicationInterview`
- **Method**: `PUT`
- **Endpoint**: [`http://localhost:8000/api/interview/:pk/`](http://localhost:8000/api/interview/:pk/)
- **Route Key**: `samfundet__interview_detail`
#### **Description**: 

 No description provided.

## `postPurchaseFeedback`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/purchase-feedback/`](http://localhost:8000/purchase-feedback/)
- **Route Key**: `samfundet__purchase_feedback`
#### **Description**: 

 No description provided.

## `postFeedback`
- **Method**: `POST`
- **Endpoint**: [`http://localhost:8000/feedback/`](http://localhost:8000/feedback/)
- **Route Key**: `samfundet__feedback`
#### **Description**: 

 No description provided.


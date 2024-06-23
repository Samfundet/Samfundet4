export const ROUTES_FRONTEND = {
  // ==================== //
  //    General/Public    //
  // ==================== //
  home: '/',
  groups: '/groups/',
  health: '/health/',
  about: '/about/',
  venues: '/venues/',
  login: '/login/',
  signup: '/signup/',
  events: '/events/',
  event: '/events/:id/',
  information_page_list: '/information/',
  information_page_detail: '/information/:slugField/',
  saksdokumenter: '/saksdokumenter/',
  membership: '/membership',
  luka: '/luka',
  // Recruitment:
  recruitment: '/recruitment/',
  recruitment_application: '/recruitment/position/:positionID/',
  recruitment_application_overview: '/recruitment/:recruitmentID/my-applications/',
  contact: '/contact',
  // ==================== //
  //        Sulten        //
  // ==================== //
  lyche: '/lyche/',
  sulten: '/lyche',
  sulten_menu: '/lyche/menu/',
  sulten_reservation: '/lyche/reservation/',
  sulten_about: '/lyche/about/',
  sulten_contact: 'lyche/contact/',
  // ==================== //
  //      Admin pages     //
  // ==================== //
  admin: '/control-panel/',
  admin_impersonate: '/impersonate/',
  // Gangs:
  admin_gangs: '/control-panel/gangs/',
  admin_gangs_create: '/control-panel/gangs/create/',
  admin_gangs_edit: '/control-panel/gangs/edit/:id/',
  // Events:
  admin_events: '/control-panel/events/',
  admin_events_edit: '/control-panel/events/edit/:id/',
  admin_events_create: '/control-panel/events/create/',
  // Info pages:
  admin_information: '/control-panel/information/',
  admin_information_edit: '/control-panel/information/edit/:slugField/',
  admin_information_create: '/control-panel/information/create/',
  // Opening hours:
  admin_opening_hours: '/control-panel/opening_hours/',
  // Closed periods:
  admin_closed: '/control-panel/closed/',
  admin_closed_create: '/control-panel/closed/create/',
  admin_closed_edit: '/control-panel/closed/edit/:id/',
  // Images:
  admin_images: '/control-panel/images/',
  admin_images_create: '/control-panel/images/create/',
  // Documents:
  admin_saksdokumenter: '/control-panel/saksdokument/',
  admin_saksdokumenter_create: '/control-panel/saksdokument/create/',
  admin_saksdokumenter_edit: '/control-panel/saksdokument/edit/:id/',
  // Recruitment:
  admin_recruitment: '/control-panel/recruitment/',
  admin_recruitment_edit: '/control-panel/recruitment/edit/:id',
  admin_recruitment_create: '/control-panel/recruitment/create/',
  admin_recruitment_users_without_interview: '/control-panel/recruitment/:recruitmentId/users-without-admissions/',
  admin_recruitment_overview: '/control-panel/recruitment/:recruitmentId/recruitment-overview/',
  admin_recruitment_gang_overview: '/control-panel/recruitment/:recruitmentId/gang-overview/',
  admin_recruitment_gang_position_overview: '/control-panel/recruitment/:recruitmentId/gang/:gangId',
  admin_recruitment_gang_position_create: '/control-panel/recruitment/:recruitmentId/gang/:gangId/create/',
  admin_recruitment_gang_position_edit: '/control-panel/recruitment/:recruitmentId/gang/:gangId/edit/:positionId',
  admin_recruitment_gang_position_applicants_overview:
    '/control-panel/recruitment/:recruitmentId/gang/:gangId/position/:positionId',
  admin_recruitment_gang_position_applicants_interview_notes:
    '/control-panel/recruitment/:recruitmentId/gang/:gangId/position/:positionId/interview-notes/:interviewId',
  admin_sulten_menu: '/control-panel/lyche/menu',
  admin_sulten_menuitem_create: '/control-panel/lyche/menuitems/create',
  admin_sulten_menuitem_edit: '/control-panel/lyche/menuitems/edit/:id',
  admin_sulten_reservations: '/control-panel/lyche/reservations',
  admin_recruitment_applicant: '/control-panel/recruitment/view-applicant/:admissionID/',
  // ==================== //
  //      Development     //
  // ==================== //
  api_testing: '/api-testing/',
  components: '/components/',
  route_overview: '/route/overview/',
  not_found: '/not_found',
} as const;

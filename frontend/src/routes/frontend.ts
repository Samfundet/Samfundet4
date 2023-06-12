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
  recruitment: '/recruitment/',
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
  admin: '/admin/',
  // Gangs
  admin_gangs: '/admin/gangs/',
  admin_gangs_create: '/admin/gangs/create/',
  admin_gangs_edit: '/admin/gangs/edit/:id/',
  // Events
  admin_events: '/admin/events/',
  admin_events_create: '/admin/events/create/',
  admin_events_edit: '/admin/events/edit/:id/',
  // Info pages
  admin_information: '/admin/information/',
  admin_information_create: '/admin/information/create/',
  admin_information_edit: '/admin/information/edit/:slugField/',
  // Opening hours
  admin_opening_hours: '/admin/opening_hours/',
  // Closed periods
  admin_closed: '/admin/closed/',
  admin_closed_create: '/admin/closed/create/',
  admin_closed_edit: '/admin/closed/edit/:id/',
  // Images
  admin_images: '/admin/images/',
  admin_images_create: '/admin/images/create/',
  // Documents
  admin_saksdokumenter: '/admin/saksdokument/',
  admin_saksdokumenter_create: '/admin/saksdokument/create/',
  admin_saksdokumenter_edit: '/admin/saksdokument/edit/:id/',
  // Recruitment
  admin_recruitment: '/admin/recruitment/',
  admin_recruitment_create: '/admin/recruitment/create/',
  admin_recruitment_edit: '/admin/recruitment/edit/:id',
  admin_recruitment_gang_overview: '/admin/recruitment/:recruitmentId/gang-overview/',
  admin_recruitment_gang_position_overview: '/admin/recruitment/:recruitmentId/gang/:gangId',
  admin_recruitment_gang_position_create: '/admin/recruitment/:recruitmentId/gang/:gangId/create/',
  admin_recruitment_gang_position_edit: '/admin/recruitment/:recruitmentId/gang/:gangId/edit/:positionId',

  // ==================== //
  //      Development     //
  // ==================== //
  api_testing: '/api-testing/',
  components: '/components/',
  route_overview: '/route/overview/',
} as const;

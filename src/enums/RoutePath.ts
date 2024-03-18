export enum RoutePath {
  //Public pages
  TheHome = '/',
  UserShow = '/user/:id',
  CategoryShow = '/category/:id',
  ForumShow = '/forum/:id',
  ThreadShow = '/thread/:id',
  ThreadCreate = '/forum/:forumid/thread/create',
  ThreadEdit = '/thread/:id/edit',
  UserRegister = '/register',
  UserLogin = '/login',
  UserLogout = '/logout',
  //Behind auth pages
  AccountEdit = '/account/edit',
  AccountShow = '/account',
  //Commun page
  NotAuthorized = '/unauthorized',
  NotFound = '/:patchMatch(.*)*',
}

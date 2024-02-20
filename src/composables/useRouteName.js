export function useRouteName() {
  const RouteName = {
    //Public pages
    TheHome: "TheHome",
    UserShow: "UserShow",
    CategoryShow: "CategoryShow",
    ForumShow: "ForumShow",
    ThreadShow: "ThreadShow",
    ThreadCreate: "ThreadCreate",
    //Behind auth pages
    AccountEdit: "AccountEdit",
    AccountShow: "AccountShow",
    //Commun page
    NotAuthorized: "NotAuthorized",
    NotFound: "NotFound",
  };
  return {
    RouteName,
  };
}

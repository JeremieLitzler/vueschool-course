export function useRouteName() {
  const RouteName = {
    //Public pages
    TheHome: "TheHome",
    UserShow: "UserShow",
    CategoryShow: "CategoryShow",
    ForumShow: "ForumShow",
    ThreadShow: "ThreadShow",
    ThreadCreate: "ThreadCreate",
    ThreadEdit: "ThreadEdit",
    UserRegister: "UserRegister",
    UserLogin: "UserLogin",
    //Behind auth pages
    AccountEdit: "AccountEdit",
    AccountShow: "AccountShow",
    //Commun page
    SignOut: "SignOut",
    NotAuthorized: "NotAuthorized",
    NotFound: "NotFound",
  };
  return {
    RouteName,
  };
}

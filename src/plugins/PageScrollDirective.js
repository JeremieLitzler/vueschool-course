//TODO: doesn't work...
const PageScrollDirective = {
  mounted(el, binding) {
    ////console.log("PageScrollDirective > mounted");
    el.__PageScrollHandler__ = () => {
      //console.log("PageScrollDirective > scrolling...");
      binding.value();
    };
    document.body.addEventListener("scroll", el.__pageScrollHandler__);
  },
  unmounted(el) {
    //console.log("PageScrollDirective > unmounted");
    document.body.removeEventListener("scroll", el.__pageScrollHandler__);
  },
};
export default (app) => {
  app.directive("page-scroll", PageScrollDirective);
};

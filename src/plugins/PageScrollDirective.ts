//TODO: doesn't work...
/**
 * See https://vuejs.org/guide/reusability/custom-directives.html#hook-arguments
 * Thanks to https://stackoverflow.com/a/76337333/3910066 for the tip on typing the Custon Directives
 */
import { App, Directive } from 'vue';

interface PageScrollDirectiveHTMLElement extends HTMLElement {
  __pageScrollHandler__: EventListenerOrEventListenerObject;
}

const PageScrollDirective = <
  Directive<PageScrollDirectiveHTMLElement, Function>
>{
  mounted(el, binding) {
    //console.log('PageScrollDirective > mounted');
    //console.log('PageScrollDirective > binding', binding);

    el.__pageScrollHandler__ = () => {
      //console.log('PageScrollDirective > scrolling...');
      binding.value();
    };

    document.body.addEventListener('scroll', el.__pageScrollHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener('scroll', el.__pageScrollHandler__);
  },
};

export default (app: App) => {
  app.directive('page-scroll', PageScrollDirective);
};

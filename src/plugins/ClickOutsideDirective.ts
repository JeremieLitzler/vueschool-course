/**
 * See https://vuejs.org/guide/reusability/custom-directives.html#hook-arguments
 * Thanks to https://stackoverflow.com/a/76337333/3910066 for the tip on typing the Custon Directives
 */
import { App, Directive } from 'vue';

interface ClickOutsideDirectiveHTMLElement extends HTMLElement {
  __clickOutsideHandler__: EventListener;
}

const ClickOutsideDirective = <
  Directive<ClickOutsideDirectiveHTMLElement, Function>
>{
  mounted(el, binding) {
    el.__clickOutsideHandler__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        //binding.value = event;
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.__clickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.__clickOutsideHandler__);
  },
};
export default {
  install(app: App) {
    app.directive('click-outside', ClickOutsideDirective);
  },
};

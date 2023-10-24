console.log('Loading Vue...');
Vue.component('click-counter', {
  template: '#click-counter-template', //this is a css selector
  data() {
    return {
      count: 0,
    };
  },
});

new Vue({
  el: '#app',
});

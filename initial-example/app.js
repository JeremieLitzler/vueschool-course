console.log('Loading Vue...');
Vue.createApp({})
  .component('click-counter', {
    template: '#click-counter-template',
    data() {
      return {
        counter: 0,
      };
    },
    methods: {
      increment() {
        this.counter += 1;
      },
    },
  })
  .mount('#app');

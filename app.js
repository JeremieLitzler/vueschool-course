console.log('Loading Vue...');
Vue.createApp({})
  .component('click-counter', {
    template: '<button @click="counter++">{{ counter }}</button>',
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

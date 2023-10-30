const PlanPickerItemComponent = {
  template: '#plan-picker-item-template',
  props: {
    itemBorderColor: {
      type: String,
      default: 'black',
    },
  },
};
const PlanPickerComponent = {
  template: '#plan-picker-template',
  data() {
    return {
      plans: [
        { name: 'The Single', color: 'blue' },
        { name: 'The Curious' },
        { name: 'The Addict', color: 'red' },
      ],
    };
  },
};

const app = Vue.createApp({})
  .component('plan-picker', PlanPickerComponent)
  .component('plan-picker-item', PlanPickerItemComponent)
  .mount('#app');

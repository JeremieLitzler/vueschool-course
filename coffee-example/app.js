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
  components: { 'plan-picker-item': PlanPickerItemComponent },
};

const app = Vue.createApp({
  components: { 'plan-picker': PlanPickerComponent },
}).mount('#app');

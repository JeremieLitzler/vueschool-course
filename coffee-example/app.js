const PlanPickerItemComponent = {
  template: '#plan-picker-item-template',
  props: {
    planId: {
      type: String,
      required: true,
    },
    itemBorderColor: {
      type: String,
      default: 'black',
    },
    isPlanSelected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectPlan() {
      this.$emit('select-plan', this.planId);
    },
  },
};

const PlanPickerComponent = {
  template: '#plan-picker-template',
  data() {
    return {
      plans: [
        {
          id: '1c127ce1-721c-4ef0-8c91-1c43bf914033',
          name: 'The Single',
          color: 'blue',
        },
        { id: '35f82e71-b5d9-4300-9f9d-47543131f172', name: 'The Curious' },
        {
          id: '6e043836-0b7a-424a-9e03-057af3450f22',
          name: 'The Addict',
          color: 'red',
        },
      ],
      selectedPlan: null,
    };
  },
  components: { 'plan-picker-item': PlanPickerItemComponent },
  methods: {
    markPlanAsSelected(planId) {
      return planId === this.selectedPlan;
    },
    receiveSelectedPlan(planItem) {
      this.selectedPlan = planItem;
    },
  },
};

const app = Vue.createApp({
  components: { 'plan-picker': PlanPickerComponent },
}).mount('#app');

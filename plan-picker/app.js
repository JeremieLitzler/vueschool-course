let PlanComponent = {
  template: '#plan-template',
  props: {
    name: {
      type: String,
      required: true,
    },
    selectedPlan: {
      type: String,
    },
  },
  computed: {
    isSelected() {
      return this.selectedPlan === this.name;
    },
  },
  methods: {
    select() {
      this.$emit('select-plan', this.name);
    },
  },
};
let PlanPickerComponent = {
  template: '#plan-picker-template',
  components: {
    'plan-item': PlanComponent,
  },
  data() {
    return {
      plans: ['The Single', 'The Curious', 'The Addict'],
      selectedPlan: null,
    };
  },
  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
    },
  },
};

new Vue({
  el: '#app',
  components: {
    'plan-picker': PlanPickerComponent,
  },
});

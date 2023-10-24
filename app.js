console.log('Loading Vue...');

Vue.use(vuelidate.default);
new Vue({
  el: '#app',
  data() {
    return { form: { name: null, age: null, email: null } };
  },
  validations: {
    form: {
      name: {
        required: validators.required,
      },
      age: {
        required: validators.required,
        integer: validators.integer,
        // min: validators.minValue(12),
        // max: validators.maxValue(120),
        // IMPORTANT: "between" include the value specified so it behave as "<=" or ">=" operators
        between: validators.between(12, 120),
      },
      email: {
        email: validators.email,
      },
    },
  },
  computed: {
    nameIsValid() {
      return !!this.form.name;
    },
    ageIsValid() {
      console.log(`Age is number >`, typeof this.form.age, this.form.age);
      return (
        typeof this.form.age === 'number' &&
        this.form.age > 12 &&
        this.form.age < 120
      );
    },
    formIsValid() {
      return this.nameIsValid && this.ageIsValid;
    },
  },
  methods: {
    submitFormVanilla() {
      if (this.formIsValid) {
        console.log(this.form);
      } else {
        console.error('❌ The form is invalid !');
      }
    },
    submitFormWithVuelidate() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(this.form);
      } else {
        console.error('❌ The form is invalid !');
      }
    },
  },
});

console.log('Loading Vue...');

const pizzaOrBurger = (value) =>
  value === 'pizza' ||
  value === 'burger' ||
  // prevent the input to be considered as required
  !validators.helpers.req(value);

const oldEnoughAndAlive = validators.between(12, 120);

Vue.use(vuelidate.default);
new Vue({
  el: '#app',
  data() {
    return {
      form: {
        name: null,
        age: null,
        email: null,
        food: null,
        newsletter: null,
        githubUsername: null,
      },
    };
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
        oldEnoughAndAlive,
      },
      email: {
        email: validators.email,
        required: validators.requiredIf(function () {
          return !!this.form.newsletter;
        }),
      },
      githubUsername: {
        exists(value) {
          if (!validators.helpers.req(value)) {
            return true;
          }
          return axios.get(`//api.github.com/users/${value}`);
        },
      },
      food: {
        pizzaOrBurger,
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
    shouldAppendValidClass(field) {
      // ex: field = $v.form.someInput
      // below we check the field:
      //  > is not invalid
      //  > is empty, otherwise it will apply the CSS class
      return !field.$invalid && field.$model;
    },
    shouldAppendErrorClass(field) {
      // ex: field = $v.form.someInput
      // below we check the field:
      //  > has no errors
      //  > is empty, otherwise it will apply the CSS class
      return !field.$error && field.$model;
    },
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

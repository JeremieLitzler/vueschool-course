let GitUserCardComponent = {
  template: '#github-user-card-template',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      user: {},
    };
  },
  watch: {
    username: function (newVal, oldVal) {
      // watch it
      console.log('Prop "username" changed: ', newVal, ' | was: ', oldVal);
    },
  },
  computed: {
    userJoinedYear() {
      return new Date(this.user.created_at).getFullYear();
    },
  },
  created() {
    console.log('GitUserCardComponent.created >', this.username);
    axios
      .get(`https://api.github.com/users/${this.username}`)
      .then((response) => {
        // console.log(response.data);
        this.user = response.data;
      })
      .catch((err) => console.error(err));
  },
};

let GitProfilesSectionComponent = {
  template: '#github-profiles-template',
  data() {
    return {
      form: { githubUsername: '' },
    };
  },
  validations: {
    form: {
      githubUsername: {
        exists(value) {
          if (!validators.helpers.req(value)) {
            return true;
          }
          return axios.get(`//api.github.com/users/${value}`);
        },
      },
    },
  },
  components: {
    'github-user-card': GitUserCardComponent,
  },
  computed: {
    isGithubUsernameProvided() {
      console.log('App.isGithubUsernameProvided >', this.form.githubUsername);
      return this.form.githubUsername !== '';
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
    submitFormWithVuelidate() {
      this.$v.form.$touch();
      console.log('Form', this.$v.form);
      if (!this.$v.form.$invalid) {
        console.log(this.form);
      } else {
        console.error('❌ The form is invalid !');
      }
    },
  },
};

Vue.use(vuelidate.default);

new Vue({
  el: '#app',
  components: {
    'github-profiles': GitProfilesSectionComponent,
  },
});

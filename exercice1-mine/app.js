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
    submitFormWithVuelidate() {
      const inputEl = document.querySelector('#github-username');
      this.form.githubUsername = inputEl.value;
    },
  },
};

Vue.createApp({
  components: {
    'github-profiles': GitProfilesSectionComponent,
  },
}).mount('#app');
